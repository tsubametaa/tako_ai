package chat

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"

	"kka-backend-go/internal/core/aiclient"
)

var (
	ErrValidation       = errors.New("validation failed")
	ErrNotFound         = errors.New("resource not found")
	ErrQueueFull        = errors.New("ai queue is busy")
)

type Store interface {
	GetOwnedConversation(ctx context.Context, userID, convID string) (*ConversationRecord, error)
	CreateGenerationTurn(ctx context.Context, userID, convID, clientReqID, content string) (*MessageDTO, *MessageDTO, *GenerationDTO, error)
	UpdateGenerationStatus(ctx context.Context, genID, genStatus, msgID, msgStatus, lastEventID string) error
	CompleteGeneration(ctx context.Context, genID, msgID, answer string, sources []SourceDTO, lastEventID string) (*MessageDTO, error)
	FailGeneration(ctx context.Context, genID, msgID, code, errMsg, lastEventID string) error
	CancelGeneration(ctx context.Context, userID, genID string) (*GenerationRecord, *MessageDTO, error)
	GetGenerationOwned(ctx context.Context, userID, genID string) (*GenerationRecord, *MessageDTO, error)
	TouchConversation(ctx context.Context, convID, newTitle, newSessionID string) (*ConversationDTO, error)
}

type PreparedTurn struct {
	Conv      *ConversationRecord
	UserMsg   *MessageDTO
	AsstMsg   *MessageDTO
	Gen       *GenerationDTO
	Req       SendMessageRequest
	UserID    string
	FullName  string
	releaseFn func()
}

type Service struct {
	store         Store
	rdb           *redis.Client
	aiClient      *aiclient.Client
	sem           chan struct{}
	queueWait     time.Duration
	aiTimeout     time.Duration
	sseEventTTL   time.Duration
}

func NewService(store Store, rdb *redis.Client, aiClient *aiclient.Client, maxInflight int, queueWait, aiTimeout, sseEventTTL time.Duration) *Service {
	if maxInflight <= 0 {
		maxInflight = 35
	}
	return &Service{
		store:       store,
		rdb:         rdb,
		aiClient:    aiClient,
		sem:         make(chan struct{}, maxInflight),
		queueWait:   queueWait,
		aiTimeout:   aiTimeout,
		sseEventTTL: sseEventTTL,
	}
}

func (s *Service) PrepareTurn(ctx context.Context, userID, fullName, convID string, req SendMessageRequest) (*PreparedTurn, error) {
	if strings.TrimSpace(convID) == "" {
		return nil, ErrNotFound
	}
	if _, err := uuid.Parse(strings.TrimSpace(req.ClientRequestID)); err != nil {
		return nil, ErrValidation
	}
	req.Content = strings.TrimSpace(req.Content)
	if req.Content == "" || utf8.RuneCountInString(req.Content) > 4000 {
		return nil, ErrValidation
	}
	if req.Mode == "" {
		req.Mode = "umum"
	}
	if req.Mode != "umum" && req.Mode != "terstruktur" {
		return nil, ErrValidation
	}

	conv, err := s.store.GetOwnedConversation(ctx, userID, convID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	waitCtx, cancelWait := context.WithTimeout(ctx, s.queueWait)
	defer cancelWait()

	select {
	case s.sem <- struct{}{}:
	case <-waitCtx.Done():
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}
		return nil, ErrQueueFull
	}

	released := false
	release := func() {
		if !released {
			released = true
			<-s.sem
		}
	}

	userMsg, asstMsg, gen, err := s.store.CreateGenerationTurn(ctx, userID, convID, req.ClientRequestID, req.Content)
	if err != nil {
		release()
		return nil, err
	}

	return &PreparedTurn{
		Conv:      conv,
		UserMsg:   userMsg,
		AsstMsg:   asstMsg,
		Gen:       gen,
		Req:       req,
		UserID:    userID,
		FullName:  truncateRunes(strings.TrimSpace(fullName), 120),
		releaseFn: release,
	}, nil
}

func (s *Service) StreamTurn(c *gin.Context, turn *PreparedTurn) {
	defer turn.releaseFn()

	reqCtx := c.Request.Context()
	aiCtx, cancelAI := context.WithTimeout(reqCtx, s.aiTimeout)
	defer cancelAI()

	stopCancelWatch := s.watchCancelSignal(aiCtx, turn.Gen.ID, cancelAI)
	defer stopCancelWatch()

	emitter := newSSEEmitter(c, turn.Gen.ID, s.rdb, s.sseEventTTL)
	keepAliveDone := make(chan struct{})
	go func() {
		ticker := time.NewTicker(15 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-keepAliveDone:
				return
			case <-reqCtx.Done():
				return
			case <-ticker.C:
				emitter.KeepAlive(reqCtx)
			}
		}
	}()
	defer close(keepAliveDone)
	lastID, _ := emitter.Emit(reqCtx, "accepted", gin.H{
		"clientRequestId":  turn.Req.ClientRequestID,
		"userMessage":      turn.UserMsg,
		"assistantMessage": turn.AsstMsg,
		"generation":       turn.Gen,
	})

	lastID, _ = emitter.Emit(reqCtx, "status", gin.H{"generationId": turn.Gen.ID, "status": "retrieving"})
	_ = s.store.UpdateGenerationStatus(reqCtx, turn.Gen.ID, "retrieving", turn.AsstMsg.ID, "pending", lastID)

	aiReq := AIChatRequest{
		UserID:            turn.UserID,
		StudentName:       turn.FullName,
		Question:          turn.Req.Content,
		SessionID:         turn.Conv.AISessionID,
		Mode:              turn.Req.Mode,
		ConsentToTraining: turn.Req.ConsentToTraining,
		ResetContext:      false,
	}

	var (
		answerBuilder   strings.Builder
		finalAnswer     string
		finalSessionID  = turn.Conv.AISessionID
		sources         []SourceDTO
		generatingSent  bool
		convTouched     bool
		deltaSeq        int
	)

	newTitle := ""
	if turn.Conv.Title == "Percakapan Baru" {
		newTitle = truncateRunes(turn.Req.Content, 60)
	}

	markGenerating := func() {
		if generatingSent {
			return
		}
		generatingSent = true
		lastID, _ = emitter.Emit(reqCtx, "status", gin.H{"generationId": turn.Gen.ID, "status": "generating"})
		_ = s.store.UpdateGenerationStatus(reqCtx, turn.Gen.ID, "generating", turn.AsstMsg.ID, "streaming", lastID)
	}

	touchConvOnce := func(sessID string) {
		if convTouched {
			return
		}
		convTouched = true
		if updatedConv, err := s.store.TouchConversation(reqCtx, turn.Conv.ID, newTitle, sessID); err == nil {
			lastID, _ = emitter.Emit(reqCtx, "conversation_updated", gin.H{"conversation": updatedConv})
		}
	}

	streamErr := s.aiClient.PostSSE(aiCtx, "/api/chat/stream", false, aiReq, func(eventName string, data []byte) error {
		switch eventName {
		case "sources":
			var evt struct {
				SessionID string           `json:"session_id"`
				Sources   []map[string]any `json:"sources"`
			}
			if json.Unmarshal(data, &evt) == nil {
				if evt.SessionID != "" {
					finalSessionID = evt.SessionID
				}
				sources = mapAISources(evt.Sources)
				if len(sources) > 0 {
					lastID, _ = emitter.Emit(reqCtx, "sources", gin.H{
						"generationId": turn.Gen.ID,
						"messageId":    turn.AsstMsg.ID,
						"sources":      sources,
					})
				}
				markGenerating()
				touchConvOnce(finalSessionID)
			}
		case "delta":
			var evt struct {
				Text string `json:"text"`
			}
			if json.Unmarshal(data, &evt) == nil && evt.Text != "" {
				markGenerating()
				answerBuilder.WriteString(evt.Text)
				deltaSeq++
				lastID, _ = emitter.Emit(reqCtx, "delta", gin.H{
					"generationId": turn.Gen.ID,
					"messageId":    turn.AsstMsg.ID,
					"sequence":     deltaSeq,
					"text":         evt.Text,
				})
			}
		case "done":
			var evt AIChatResponse
			if json.Unmarshal(data, &evt) == nil {
				if evt.SessionID != "" {
					finalSessionID = evt.SessionID
				}
				if evt.Answer != "" {
					finalAnswer = evt.Answer
				}
				if len(evt.Sources) > 0 && len(sources) == 0 {
					sources = mapAISources(evt.Sources)
				}
			}
		case "error":
			var evt struct {
				Detail string `json:"detail"`
			}
			_ = json.Unmarshal(data, &evt)
			msg := strings.TrimSpace(evt.Detail)
			if msg == "" {
				msg = "Layanan AI tidak tersedia."
			}
			return &aiclient.UpstreamError{
				StatusCode: http.StatusServiceUnavailable,
				Code:       "AI_UNAVAILABLE",
				Message:    msg,
				Retryable:  true,
			}
		}
		return nil
	})

	if streamErr != nil {
		// Fallback ke endpoint non-stream jika kka_lab versi lama belum memiliki /api/chat/stream
		var upErr *aiclient.UpstreamError
		if errors.As(streamErr, &upErr) && (upErr.StatusCode == http.StatusNotFound || upErr.StatusCode == http.StatusMethodNotAllowed) {
			var aiResp AIChatResponse
			if err := s.aiClient.DoJSON(aiCtx, http.MethodPost, "/api/chat", false, aiReq, &aiResp); err != nil {
				s.handleAIError(reqCtx, emitter, turn, err, lastID)
				return
			}
			if aiResp.SessionID != "" {
				finalSessionID = aiResp.SessionID
			}
			markGenerating()
			touchConvOnce(finalSessionID)
			sources = mapAISources(aiResp.Sources)
			if len(sources) > 0 {
				lastID, _ = emitter.Emit(reqCtx, "sources", gin.H{
					"generationId": turn.Gen.ID,
					"messageId":    turn.AsstMsg.ID,
					"sources":      sources,
				})
			}
			for _, chunk := range chunkRunes(aiResp.Answer, 24) {
				if aiCtx.Err() != nil {
					s.handleAIError(reqCtx, emitter, turn, aiCtx.Err(), lastID)
					return
				}
				deltaSeq++
				lastID, _ = emitter.Emit(reqCtx, "delta", gin.H{
					"generationId": turn.Gen.ID,
					"messageId":    turn.AsstMsg.ID,
					"sequence":     deltaSeq,
					"text":         chunk,
				})
			}
			finalAnswer = aiResp.Answer
		} else {
			s.handleAIError(reqCtx, emitter, turn, streamErr, lastID)
			return
		}
	}

	if finalAnswer == "" {
		finalAnswer = answerBuilder.String()
	}
	touchConvOnce(finalSessionID)

	dbCtx, cancelDB := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelDB()

	finalMsg, err := s.store.CompleteGeneration(dbCtx, turn.Gen.ID, turn.AsstMsg.ID, finalAnswer, sources, lastID)
	if err != nil {
		_, _ = emitter.Emit(reqCtx, "generation_error", gin.H{
			"generationId": turn.Gen.ID,
			"messageId":    turn.AsstMsg.ID,
			"code":         "INTERNAL_ERROR",
			"message":      "Gagal menyimpan jawaban asisten.",
		})
		return
	}

	_, _ = emitter.Emit(reqCtx, "done", gin.H{
		"generationId": turn.Gen.ID,
		"message":      finalMsg,
	})
}

func (s *Service) handleAIError(reqCtx context.Context, emitter *sseEmitter, turn *PreparedTurn, err error, lastID string) {
	dbCtx, cancelDB := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelDB()

	if errors.Is(err, context.Canceled) {
		_, msg, _ := s.store.CancelGeneration(dbCtx, turn.UserID, turn.Gen.ID)
		_, _ = emitter.Emit(context.Background(), "cancelled", gin.H{
			"generationId": turn.Gen.ID,
			"message":      msg,
		})
		return
	}

	code, msg := classifyStreamError(err)
	_ = s.store.FailGeneration(dbCtx, turn.Gen.ID, turn.AsstMsg.ID, code, msg, lastID)
	_, _ = emitter.Emit(reqCtx, "generation_error", gin.H{
		"generationId": turn.Gen.ID,
		"messageId":    turn.AsstMsg.ID,
		"code":         code,
		"message":      msg,
	})
}

func (s *Service) Cancel(ctx context.Context, userID, genID string) (*GenerationRecord, error) {
	if _, err := uuid.Parse(genID); err != nil {
		return nil, ErrNotFound
	}
	rec, _, err := s.store.CancelGeneration(ctx, userID, genID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	if s.rdb != nil {
		_ = s.rdb.Publish(ctx, cancelChannel(genID), "cancel").Err()
	}
	return rec, nil
}

func (s *Service) watchCancelSignal(ctx context.Context, genID string, cancelFn context.CancelFunc) func() {
	if s.rdb == nil {
		return func() {}
	}
	sub := s.rdb.Subscribe(ctx, cancelChannel(genID))
	go func() {
		ch := sub.Channel()
		select {
		case <-ctx.Done():
		case _, ok := <-ch:
			if ok {
				cancelFn()
			}
		}
	}()
	return func() { _ = sub.Close() }
}

func classifyStreamError(err error) (string, string) {
	if errors.Is(err, aiclient.ErrCircuitOpen) || errors.Is(err, context.DeadlineExceeded) {
		return "AI_UNAVAILABLE", "Asisten sedang belum dapat merespons. Coba kembali sebentar lagi."
	}
	var upErr *aiclient.UpstreamError
	if errors.As(err, &upErr) {
		return upErr.Code, upErr.Message
	}
	return "AI_UNAVAILABLE", "Layanan AI sedang tidak dapat dihubungi."
}

func truncateRunes(s string, maxLen int) string {
	r := []rune(s)
	if len(r) <= maxLen {
		return s
	}
	return string(r[:maxLen])
}
