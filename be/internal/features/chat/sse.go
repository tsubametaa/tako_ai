package chat

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
)

type sseEnvelope struct {
	ID    string          `json:"id"`
	Event string          `json:"event"`
	Data  json.RawMessage `json:"data"`
}

type sseEmitter struct {
	mu      sync.Mutex
	genID   string
	rdb     *redis.Client
	ttl     time.Duration
	seq     int
	writer  gin.ResponseWriter
	flusher http.Flusher
}

func newSSEEmitter(c *gin.Context, genID string, rdb *redis.Client, ttl time.Duration) *sseEmitter {
	flusher, _ := c.Writer.(http.Flusher)
	return &sseEmitter{
		genID:   genID,
		rdb:     rdb,
		ttl:     ttl,
		writer:  c.Writer,
		flusher: flusher,
	}
}

func setSSEHeaders(c *gin.Context) {
	h := c.Writer.Header()
	h.Set("Content-Type", "text/event-stream")
	h.Set("Cache-Control", "no-cache")
	h.Set("Connection", "keep-alive")
	h.Set("X-Accel-Buffering", "no")
	c.Status(http.StatusOK)
}

func (e *sseEmitter) Emit(ctx context.Context, eventName string, payload any) (string, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	e.seq++
	id := fmt.Sprintf("evt_%04d", e.seq)

	rawData, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	if e.rdb != nil {
		env, err := json.Marshal(sseEnvelope{ID: id, Event: eventName, Data: rawData})
		if err == nil {
			storeCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			listKey := eventListKey(e.genID)
			pipe := e.rdb.Pipeline()
			pipe.RPush(storeCtx, listKey, string(env))
			pipe.Expire(storeCtx, listKey, e.ttl)
			pipe.Publish(storeCtx, eventStreamChannel(e.genID), string(env))
			_, _ = pipe.Exec(storeCtx)
			cancel()
		}
	}

	if ctx.Err() == nil {
		_ = writeSSEFrame(e.writer, id, eventName, rawData)
		if e.flusher != nil {
			e.flusher.Flush()
		}
	}
	return id, nil
}

// KeepAlive writes an SSE comment frame so proxies and browsers keep the stream open during long LLM inference.
func (e *sseEmitter) KeepAlive(ctx context.Context) {
	e.mu.Lock()
	defer e.mu.Unlock()
	if ctx.Err() != nil {
		return
	}
	_, _ = fmt.Fprint(e.writer, ": keepalive\n\n")
	if e.flusher != nil {
		e.flusher.Flush()
	}
}

func writeSSEFrame(w io.Writer, id, event string, data []byte) error {
	_, err := fmt.Fprintf(w, "id: %s\nevent: %s\ndata: %s\n\n", id, event, data)
	return err
}

func eventListKey(genID string) string {
	return "gen:events:" + genID
}

func eventStreamChannel(genID string) string {
	return "gen:stream:" + genID
}

func cancelChannel(genID string) string {
	return "gen:cancel:" + genID
}

func isTerminalEvent(event string) bool {
	return event == "done" || event == "cancelled" || event == "generation_error"
}

func chunkRunes(s string, size int) []string {
	if s == "" {
		return nil
	}
	runes := []rune(s)
	chunks := make([]string, 0, (len(runes)+size-1)/size)
	for i := 0; i < len(runes); i += size {
		end := min(i+size, len(runes))
		chunks = append(chunks, string(runes[i:end]))
	}
	return chunks
}

func (s *Service) ReplayEvents(c *gin.Context, userID, genID, afterID string) error {
	if _, err := uuid.Parse(genID); err != nil {
		return ErrNotFound
	}
	rec, msg, err := s.store.GetGenerationOwned(c.Request.Context(), userID, genID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}

	setSSEHeaders(c)
	flusher, _ := c.Writer.(http.Flusher)

	var sub *redis.PubSub
	if s.rdb != nil && !isTerminalStatus(rec.Status) {
		sub = s.rdb.Subscribe(c.Request.Context(), eventStreamChannel(genID))
		defer sub.Close()
	}

	lastSeen := afterID
	terminalSent := false

	if s.rdb != nil {
		rawEvents, _ := s.rdb.LRange(c.Request.Context(), eventListKey(genID), 0, -1).Result()
		startIdx := 0
		if afterID != "" {
			startIdx = len(rawEvents)
			for i, raw := range rawEvents {
				var env sseEnvelope
				if json.Unmarshal([]byte(raw), &env) == nil && env.ID == afterID {
					startIdx = i + 1
					break
				}
			}
		}
		for i := startIdx; i < len(rawEvents); i++ {
			var env sseEnvelope
			if json.Unmarshal([]byte(rawEvents[i]), &env) != nil {
				continue
			}
			_ = writeSSEFrame(c.Writer, env.ID, env.Event, env.Data)
			lastSeen = env.ID
			if isTerminalEvent(env.Event) {
				terminalSent = true
			}
		}
		if flusher != nil {
			flusher.Flush()
		}
	}

	if terminalSent {
		return nil
	}
	if isTerminalStatus(rec.Status) {
		s.emitTerminalFallback(c, rec, msg, flusher)
		return nil
	}
	if sub == nil {
		return nil
	}

	ch := sub.Channel()
	for {
		select {
		case <-c.Request.Context().Done():
			return nil
		case redisMsg, ok := <-ch:
			if !ok {
				return nil
			}
			var env sseEnvelope
			if json.Unmarshal([]byte(redisMsg.Payload), &env) != nil || env.ID == lastSeen {
				continue
			}
			_ = writeSSEFrame(c.Writer, env.ID, env.Event, env.Data)
			if flusher != nil {
				flusher.Flush()
			}
			lastSeen = env.ID
			if isTerminalEvent(env.Event) {
				return nil
			}
		}
	}
}

func (s *Service) emitTerminalFallback(c *gin.Context, rec *GenerationRecord, msg *MessageDTO, flusher http.Flusher) {
	var eventName string
	var payload any

	switch rec.Status {
	case "completed":
		eventName = "done"
		payload = gin.H{"generationId": rec.ID, "message": msg}
	case "cancelled":
		eventName = "cancelled"
		payload = gin.H{"generationId": rec.ID, "message": msg}
	default:
		code := "AI_UNAVAILABLE"
		errMsg := "Gagal memproses jawaban asisten."
		if rec.ErrorCode != nil && *rec.ErrorCode != "" {
			code = *rec.ErrorCode
		}
		if rec.ErrorMessage != nil && *rec.ErrorMessage != "" {
			errMsg = *rec.ErrorMessage
		}
		eventName = "generation_error"
		payload = gin.H{"generationId": rec.ID, "messageId": rec.AssistantMessageID, "code": code, "message": errMsg}
	}

	raw, _ := json.Marshal(payload)
	evtID := "evt_final"
	if rec.LastEventID != nil && *rec.LastEventID != "" {
		evtID = *rec.LastEventID
	}
	_ = writeSSEFrame(c.Writer, evtID, eventName, raw)
	if flusher != nil {
		flusher.Flush()
	}
}

func isTerminalStatus(status string) bool {
	return status == "completed" || status == "cancelled" || status == "failed"
}
