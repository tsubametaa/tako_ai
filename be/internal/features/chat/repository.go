package chat

import (
	"context"
	"errors"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"kka-backend-go/internal/core/astradb"
)

var (
	ErrDuplicateRequest = errors.New("duplicate client request")
	ErrActiveGeneration = errors.New("another generation is active")
)

type Repository struct {
	astra *astradb.Client
	mu    sync.Mutex
	gens  map[string]*GenerationRecord
	msgs  map[string]*MessageDTO
}

func NewRepository(astra *astradb.Client) *Repository {
	return &Repository{
		astra: astra,
		gens:  make(map[string]*GenerationRecord),
		msgs:  make(map[string]*MessageDTO),
	}
}

type astraSessionDoc struct {
	ID        string  `json:"_id"`
	Type      string  `json:"type"`
	SessionID string  `json:"session_id"`
	UserID    string  `json:"user_id"`
	Title     string  `json:"title"`
	Question  string  `json:"question"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
	Timestamp float64 `json:"timestamp"`
}

func (r *Repository) GetOwnedConversation(ctx context.Context, userID, convID string) (*ConversationRecord, error) {
	if r.astra == nil || !r.astra.IsConfigured() {
		return &ConversationRecord{
			ID:          convID,
			Title:       "Percakapan Baru",
			AISessionID: convID,
		}, nil
	}

	var doc astraSessionDoc
	found, err := r.astra.FindOne(ctx, map[string]any{
		"_id":     "sess_" + convID,
		"user_id": userID,
	}, &doc)
	if err != nil {
		return nil, err
	}
	if !found {
		found, err = r.astra.FindOne(ctx, map[string]any{
			"session_id": convID,
			"user_id":    userID,
		}, &doc)
		if err != nil {
			return nil, err
		}
		if !found {
			return nil, pgx.ErrNoRows
		}
	}

	title := strings.TrimSpace(doc.Title)
	if title == "" {
		title = "Percakapan Baru"
	}

	return &ConversationRecord{
		ID:          convID,
		Title:       title,
		AISessionID: convID,
	}, nil
}

func (r *Repository) CreateGenerationTurn(_ context.Context, _, convID, clientReqID, content string) (*MessageDTO, *MessageDTO, *GenerationDTO, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	now := time.Now().UTC()
	userMsgID := uuid.NewString()
	asstMsgID := uuid.NewString()
	genID := uuid.NewString()

	userMsg := &MessageDTO{
		ID:              userMsgID,
		ConversationID:  convID,
		ClientRequestID: clientReqID,
		Role:            "user",
		Content:         content,
		CreatedAt:       now,
		Status:          "completed",
		Sources:         []SourceDTO{},
	}

	asstMsg := &MessageDTO{
		ID:              asstMsgID,
		ConversationID:  convID,
		ClientRequestID: clientReqID,
		Role:            "assistant",
		Content:         "",
		CreatedAt:       now,
		Status:          "pending",
		GenerationID:    &genID,
		Sources:         []SourceDTO{},
	}

	gen := &GenerationDTO{
		ID:                 genID,
		ConversationID:     convID,
		AssistantMessageID: asstMsgID,
		Status:             "queued",
	}

	r.gens[genID] = &GenerationRecord{
		ID:                 genID,
		ConversationID:     convID,
		AssistantMessageID: asstMsgID,
		Status:             "queued",
	}
	r.msgs[asstMsgID] = asstMsg

	return userMsg, asstMsg, gen, nil
}

func (r *Repository) UpdateGenerationStatus(_ context.Context, genID, genStatus, msgID, msgStatus, lastEventID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if g, ok := r.gens[genID]; ok {
		g.Status = genStatus
		if lastEventID != "" {
			evt := lastEventID
			g.LastEventID = &evt
		}
	}
	if m, ok := r.msgs[msgID]; ok && msgStatus != "" {
		m.Status = msgStatus
	}
	return nil
}

func (r *Repository) CompleteGeneration(_ context.Context, genID, msgID, answer string, sources []SourceDTO, lastEventID string) (*MessageDTO, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if g, ok := r.gens[genID]; ok {
		g.Status = "completed"
		if lastEventID != "" {
			evt := lastEventID
			g.LastEventID = &evt
		}
	}

	msg, ok := r.msgs[msgID]
	if !ok {
		now := time.Now().UTC()
		msg = &MessageDTO{
			ID:           msgID,
			Role:         "assistant",
			CreatedAt:    now,
			GenerationID: &genID,
		}
	}
	msg.Content = answer
	msg.Status = "completed"
	msg.Sources = sources
	return msg, nil
}

func (r *Repository) FailGeneration(_ context.Context, genID, msgID, code, errMsg, lastEventID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if g, ok := r.gens[genID]; ok {
		g.Status = "failed"
		g.ErrorCode = &code
		g.ErrorMessage = &errMsg
		if lastEventID != "" {
			evt := lastEventID
			g.LastEventID = &evt
		}
	}
	if m, ok := r.msgs[msgID]; ok {
		m.Status = "failed"
	}
	return nil
}

func (r *Repository) CancelGeneration(_ context.Context, _, genID string) (*GenerationRecord, *MessageDTO, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	g, ok := r.gens[genID]
	if !ok {
		return nil, nil, pgx.ErrNoRows
	}
	g.Status = "cancelled"
	m := r.msgs[g.AssistantMessageID]
	if m != nil {
		m.Status = "cancelled"
	}
	cp := *g
	return &cp, m, nil
}

func (r *Repository) GetGenerationOwned(_ context.Context, _, genID string) (*GenerationRecord, *MessageDTO, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	g, ok := r.gens[genID]
	if !ok {
		return nil, nil, pgx.ErrNoRows
	}
	cp := *g
	return &cp, r.msgs[g.AssistantMessageID], nil
}

func (r *Repository) TouchConversation(ctx context.Context, convID, newTitle, newSessionID string) (*ConversationDTO, error) {
	now := time.Now().UTC()
	nowISO := now.Format(time.RFC3339Nano)
	nowTS := float64(now.UnixNano()) / 1e9

	targetID := convID
	if newSessionID != "" {
		targetID = newSessionID
	}

	if r.astra != nil && r.astra.IsConfigured() {
		fields := map[string]any{
			"type":       "session",
			"session_id": targetID,
			"updated_at": nowISO,
			"timestamp":  nowTS,
		}
		if strings.TrimSpace(newTitle) != "" {
			fields["title"] = strings.TrimSpace(newTitle)
		}
		_ = r.astra.UpsertOne(ctx, map[string]any{"_id": "sess_" + convID}, fields)
	}

	title := strings.TrimSpace(newTitle)
	if title == "" {
		title = "Percakapan"
	}
	return &ConversationDTO{
		ID:             convID,
		Title:          title,
		CreatedAt:      now,
		UpdatedAt:      now,
		LastActivityAt: now,
	}, nil
}
