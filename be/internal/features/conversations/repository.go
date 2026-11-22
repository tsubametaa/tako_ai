package conversations

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"kka-backend-go/internal/core/astradb"
)

type Repository struct {
	astra *astradb.Client
}

func NewRepository(astra *astradb.Client) *Repository {
	return &Repository{astra: astra}
}

type astraChatDoc struct {
	ID                   string           `json:"_id"`
	Type                 string           `json:"type"`
	SessionID            string           `json:"session_id"`
	UserID               string           `json:"user_id"`
	ClientConversationID string           `json:"client_conversation_id"`
	Title                string           `json:"title"`
	Question             string           `json:"question"`
	Answer               string           `json:"answer"`
	Mode                 string           `json:"mode"`
	Persona              string           `json:"persona,omitempty"`
	TrainingStatus       string           `json:"training_status,omitempty"`
	TrainingReason       string           `json:"training_reason,omitempty"`
	Sources              []map[string]any `json:"sources"`
	CreatedAt            string           `json:"created_at"`
	UpdatedAt            string           `json:"updated_at"`
	Timestamp            float64          `json:"timestamp"`
}

func parseTimeOrNow(iso string, ts float64) time.Time {
	if iso != "" {
		if t, err := time.Parse(time.RFC3339Nano, iso); err == nil {
			return t.UTC()
		}
		if t, err := time.Parse(time.RFC3339, iso); err == nil {
			return t.UTC()
		}
	}
	if ts > 0 {
		sec := int64(ts)
		nsec := int64((ts - float64(sec)) * 1e9)
		return time.Unix(sec, nsec).UTC()
	}
	return time.Now().UTC()
}

func (r *Repository) List(ctx context.Context, userID, queryText string, cursorTime *time.Time, _ string, limit int) ([]ConversationDTO, error) {
	if r.astra == nil || !r.astra.IsConfigured() {
		return []ConversationDTO{}, nil
	}

	var docs []astraChatDoc
	err := r.astra.Find(
		ctx,
		map[string]any{
			"user_id": userID,
			"type":    map[string]any{"$in": []string{"session", "exchange"}},
		},
		map[string]any{"timestamp": -1},
		150,
		&docs,
	)
	if err != nil {
		return nil, err
	}

	bySession := make(map[string]*ConversationDTO)
	for _, d := range docs {
		sid := strings.TrimSpace(d.SessionID)
		if sid == "" {
			continue
		}
		t := parseTimeOrNow(d.CreatedAt, d.Timestamp)
		u := parseTimeOrNow(d.UpdatedAt, d.Timestamp)
		if u.Before(t) {
			u = t
		}

		conv, exists := bySession[sid]
		if !exists {
			conv = &ConversationDTO{
				ID:             sid,
				Title:          "Percakapan Baru",
				CreatedAt:      t,
				UpdatedAt:      u,
				LastActivityAt: u,
			}
			bySession[sid] = conv
		}

		if t.Before(conv.CreatedAt) {
			conv.CreatedAt = t
		}
		if u.After(conv.LastActivityAt) {
			conv.LastActivityAt = u
			conv.UpdatedAt = u
		}

		if d.Type == "session" && strings.TrimSpace(d.Title) != "" {
			conv.Title = strings.TrimSpace(d.Title)
		} else if d.Type == "exchange" && (conv.Title == "" || conv.Title == "Percakapan Baru") && strings.TrimSpace(d.Question) != "" {
			conv.Title = truncateRunes(strings.TrimSpace(d.Question), 60)
		}
	}

	qLower := strings.ToLower(strings.TrimSpace(queryText))
	items := make([]ConversationDTO, 0, len(bySession))
	for _, conv := range bySession {
		if qLower != "" && !strings.Contains(strings.ToLower(conv.Title), qLower) {
			continue
		}
		if cursorTime != nil && !conv.LastActivityAt.Before(*cursorTime) {
			continue
		}
		items = append(items, *conv)
	}

	sort.Slice(items, func(i, j int) bool {
		return items[i].LastActivityAt.After(items[j].LastActivityAt)
	})

	if limit > 0 && len(items) > limit {
		items = items[:limit]
	}
	return items, nil
}

func (r *Repository) CreateIdempotent(ctx context.Context, userID, clientConvID, title string) (ConversationDTO, bool, error) {
	now := time.Now().UTC()
	if r.astra == nil || !r.astra.IsConfigured() {
		id := uuid.NewString()
		return ConversationDTO{ID: id, Title: title, CreatedAt: now, UpdatedAt: now, LastActivityAt: now}, true, nil
	}

	var existing astraChatDoc
	found, err := r.astra.FindOne(ctx, map[string]any{
		"type":                   "session",
		"user_id":                userID,
		"client_conversation_id": clientConvID,
	}, &existing)
	if err == nil && found && existing.SessionID != "" {
		t := parseTimeOrNow(existing.CreatedAt, existing.Timestamp)
		u := parseTimeOrNow(existing.UpdatedAt, existing.Timestamp)
		savedTitle := existing.Title
		if savedTitle == "" {
			savedTitle = title
		}
		return ConversationDTO{
			ID:             existing.SessionID,
			Title:          savedTitle,
			CreatedAt:      t,
			UpdatedAt:      u,
			LastActivityAt: u,
		}, false, nil
	}

	sessionID := uuid.NewString()
	nowISO := now.Format(time.RFC3339Nano)
	nowTS := float64(now.UnixNano()) / 1e9

	doc := map[string]any{
		"_id":                    "sess_" + sessionID,
		"type":                   "session",
		"session_id":             sessionID,
		"user_id":                userID,
		"client_conversation_id": clientConvID,
		"title":                  title,
		"created_at":             nowISO,
		"updated_at":             nowISO,
		"timestamp":              nowTS,
	}
	if err := r.astra.InsertOne(ctx, doc); err != nil {
		return ConversationDTO{}, false, err
	}

	return ConversationDTO{
		ID:             sessionID,
		Title:          title,
		CreatedAt:      now,
		UpdatedAt:      now,
		LastActivityAt: now,
	}, true, nil
}

func (r *Repository) GetOwned(ctx context.Context, userID, convID string) (*ConversationDTO, error) {
	if r.astra == nil || !r.astra.IsConfigured() {
		return nil, pgx.ErrNoRows
	}

	var doc astraChatDoc
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

	t := parseTimeOrNow(doc.CreatedAt, doc.Timestamp)
	u := parseTimeOrNow(doc.UpdatedAt, doc.Timestamp)
	title := strings.TrimSpace(doc.Title)
	if title == "" {
		if strings.TrimSpace(doc.Question) != "" {
			title = truncateRunes(strings.TrimSpace(doc.Question), 60)
		} else {
			title = "Percakapan Baru"
		}
	}
	return &ConversationDTO{
		ID:             convID,
		Title:          title,
		CreatedAt:      t,
		UpdatedAt:      u,
		LastActivityAt: u,
	}, nil
}

func (r *Repository) Rename(ctx context.Context, userID, convID, title string) (*ConversationDTO, error) {
	conv, err := r.GetOwned(ctx, userID, convID)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	nowISO := now.Format(time.RFC3339Nano)
	err = r.astra.UpsertOne(
		ctx,
		map[string]any{"_id": "sess_" + convID},
		map[string]any{
			"type":       "session",
			"session_id": convID,
			"user_id":    userID,
			"title":      title,
			"updated_at": nowISO,
		},
	)
	if err != nil {
		return nil, err
	}

	conv.Title = title
	conv.UpdatedAt = now
	return conv, nil
}

func (r *Repository) Delete(ctx context.Context, userID, convID string) (string, bool, error) {
	if _, err := r.GetOwned(ctx, userID, convID); err != nil {
		if err == pgx.ErrNoRows {
			return "", false, nil
		}
		return "", false, err
	}

	err := r.astra.DeleteMany(ctx, map[string]any{
		"session_id": convID,
		"user_id":    userID,
	})
	if err != nil {
		return "", false, err
	}
	return "", true, nil
}

func (r *Repository) ListMessages(ctx context.Context, convID string, _ *time.Time, _ string, limit int) ([]MessageDTO, error) {
	if r.astra == nil || !r.astra.IsConfigured() {
		return []MessageDTO{}, nil
	}

	var exchanges []astraChatDoc
	err := r.astra.Find(
		ctx,
		map[string]any{
			"type":       "exchange",
			"session_id": convID,
		},
		map[string]any{"timestamp": 1},
		100,
		&exchanges,
	)
	if err != nil {
		return nil, err
	}

	sort.Slice(exchanges, func(i, j int) bool {
		return exchanges[i].Timestamp < exchanges[j].Timestamp
	})

	chronological := make([]MessageDTO, 0, len(exchanges)*2)
	for _, ex := range exchanges {
		t := parseTimeOrNow(ex.CreatedAt, ex.Timestamp)
		reqID := ex.ID
		chronological = append(chronological,
			MessageDTO{
				ID:              ex.ID + ":user",
				ConversationID:  convID,
				ClientRequestID: reqID,
				Role:            "user",
				Content:         ex.Question,
				CreatedAt:       t,
				Status:          "completed",
				Sources:         []SourceDTO{},
			},
			MessageDTO{
				ID:              ex.ID + ":assistant",
				ConversationID:  convID,
				ClientRequestID: reqID,
				Role:            "assistant",
				Content:         ex.Answer,
				CreatedAt:       t.Add(time.Millisecond),
				Status:          "completed",
				Sources:         mapAstraSources(ex.Sources),
			},
		)
	}

	// service.MessagesPage calls slices.Reverse(rows), so return newest-first here.
	desc := make([]MessageDTO, 0, len(chronological))
	for i := len(chronological) - 1; i >= 0; i-- {
		desc = append(desc, chronological[i])
	}
	if limit > 0 && len(desc) > limit {
		desc = desc[:limit]
	}
	return desc, nil
}

func (r *Repository) GetActiveGeneration(_ context.Context, _ string) (*GenerationDTO, error) {
	return nil, pgx.ErrNoRows
}

func (r *Repository) FindRequest(_ context.Context, _, _, _ string) (*RequestLookupDTO, error) {
	return nil, pgx.ErrNoRows
}

func mapAstraSources(raw []map[string]any) []SourceDTO {
	out := make([]SourceDTO, 0, len(raw))
	for i, item := range raw {
		id := strFromMap(item, "id")
		if id == "" {
			id = fmt.Sprintf("src_%d", i+1)
		}
		title := strFromMap(item, "title", "filename", "source", "document")
		if title == "" {
			title = fmt.Sprintf("Materi %d", i+1)
		}
		label := strFromMap(item, "label")
		if label == "" {
			label = fmt.Sprintf("Sumber %d", i+1)
		}
		topic := strFromMap(item, "topic", "section")
		excerpt := strFromMap(item, "excerpt", "snippet", "content")
		urlStr := strFromMap(item, "url")

		var pages []int
		if arr, ok := item["pages"].([]any); ok {
			for _, v := range arr {
				if f, ok := v.(float64); ok {
					pages = append(pages, int(f))
				}
			}
		} else if arr, ok := item["pages_pdf"].([]any); ok {
			for _, v := range arr {
				if f, ok := v.(float64); ok {
					pages = append(pages, int(f))
				}
			}
		} else if f, ok := item["page"].(float64); ok {
			pages = []int{int(f)}
		}

		out = append(out, SourceDTO{
			ID:      id,
			Label:   label,
			Title:   title,
			Pages:   pages,
			Topic:   topic,
			Excerpt: excerpt,
			URL:     urlStr,
		})
	}
	return out
}

func strFromMap(m map[string]any, keys ...string) string {
	for _, k := range keys {
		if s, ok := m[k].(string); ok && s != "" {
			return s
		}
	}
	return ""
}
