package conversations

import (
	"context"
	"encoding/base64"
	"errors"
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
)

var (
	ErrValidation = errors.New("validation failed")
	ErrNotFound   = errors.New("conversation not found")
)

type Store interface {
	List(ctx context.Context, userID, queryText string, cursorTime *time.Time, cursorID string, limit int) ([]ConversationDTO, error)
	CreateIdempotent(ctx context.Context, userID, clientConvID, title string) (ConversationDTO, bool, error)
	GetOwned(ctx context.Context, userID, convID string) (*ConversationDTO, error)
	Rename(ctx context.Context, userID, convID, title string) (*ConversationDTO, error)
	Delete(ctx context.Context, userID, convID string) (string, bool, error)
	ListMessages(ctx context.Context, convID string, beforeTime *time.Time, beforeID string, limit int) ([]MessageDTO, error)
	GetActiveGeneration(ctx context.Context, convID string) (*GenerationDTO, error)
	FindRequest(ctx context.Context, userID, convID, clientReqID string) (*RequestLookupDTO, error)
}

type Service struct {
	store Store
	rdb   *redis.Client
}

func NewService(store Store, rdb *redis.Client) *Service {
	return &Service{store: store, rdb: rdb}
}

func (s *Service) List(ctx context.Context, userID, queryText, cursor string, limit int) (ListResponseDTO, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	ct, cid, err := decodeCursor(cursor)
	if err != nil {
		return ListResponseDTO{}, ErrValidation
	}

	rows, err := s.store.List(ctx, userID, strings.TrimSpace(queryText), ct, cid, limit+1)
	if err != nil {
		return ListResponseDTO{}, err
	}

	var nextCursor *string
	if len(rows) > limit {
		rows = rows[:limit]
		last := rows[len(rows)-1]
		encoded := encodeCursor(last.LastActivityAt, last.ID)
		nextCursor = &encoded
	}
	return ListResponseDTO{Items: rows, NextCursor: nextCursor}, nil
}

func (s *Service) Create(ctx context.Context, userID string, req CreateRequest) (ConversationDTO, bool, error) {
	if _, err := uuid.Parse(strings.TrimSpace(req.ClientConversationID)); err != nil {
		return ConversationDTO{}, false, ErrValidation
	}
	title := strings.TrimSpace(req.Title)
	if title == "" {
		title = "Percakapan Baru"
	} else {
		title = truncateRunes(title, 60)
	}
	return s.store.CreateIdempotent(ctx, userID, req.ClientConversationID, title)
}

func (s *Service) Rename(ctx context.Context, userID, convID string, req RenameRequest) (*ConversationDTO, error) {
	if strings.TrimSpace(convID) == "" {
		return nil, ErrNotFound
	}
	title := strings.TrimSpace(req.Title)
	if title == "" || utf8.RuneCountInString(title) > 100 {
		return nil, ErrValidation
	}

	conv, err := s.store.Rename(ctx, userID, convID, title)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return conv, nil
}

func (s *Service) Delete(ctx context.Context, userID, convID string) error {
	if strings.TrimSpace(convID) == "" {
		return ErrNotFound
	}
	activeGenID, deleted, err := s.store.Delete(ctx, userID, convID)
	if err != nil {
		return err
	}
	if !deleted {
		return ErrNotFound
	}
	if activeGenID != "" && s.rdb != nil {
		_ = s.rdb.Publish(ctx, "gen:cancel:"+activeGenID, "cancel").Err()
	}
	return nil
}

func (s *Service) MessagesPage(ctx context.Context, userID, convID, before string, limit int) (*MessagesPageDTO, error) {
	if strings.TrimSpace(convID) == "" {
		return nil, ErrNotFound
	}
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	bt, bid, err := decodeCursor(before)
	if err != nil {
		return nil, ErrValidation
	}

	conv, err := s.store.GetOwned(ctx, userID, convID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	rows, err := s.store.ListMessages(ctx, convID, bt, bid, limit+1)
	if err != nil {
		return nil, err
	}

	var olderCursor *string
	if len(rows) > limit {
		rows = rows[:limit]
		oldest := rows[len(rows)-1]
		encoded := encodeCursor(oldest.CreatedAt, oldest.ID)
		olderCursor = &encoded
	}
	slices.Reverse(rows)

	activeGen, err := s.store.GetActiveGeneration(ctx, convID)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}
	if errors.Is(err, pgx.ErrNoRows) {
		activeGen = nil
	}

	var eventCursor *string
	if activeGen != nil {
		eventCursor = activeGen.LastEventID
	}

	return &MessagesPageDTO{
		Conversation:     *conv,
		Items:            rows,
		OlderCursor:      olderCursor,
		ActiveGeneration: activeGen,
		EventCursor:      eventCursor,
	}, nil
}

func (s *Service) LookupRequest(ctx context.Context, userID, convID, clientReqID string) (*RequestLookupDTO, error) {
	if _, err := uuid.Parse(convID); err != nil {
		return nil, ErrNotFound
	}
	if _, err := uuid.Parse(clientReqID); err != nil {
		return nil, ErrValidation
	}
	if _, err := s.store.GetOwned(ctx, userID, convID); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	res, err := s.store.FindRequest(ctx, userID, convID, clientReqID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return res, nil
}

func encodeCursor(t time.Time, id string) string {
	raw := t.UTC().Format(time.RFC3339Nano) + "|" + id
	return base64.RawURLEncoding.EncodeToString([]byte(raw))
}

func decodeCursor(cursor string) (*time.Time, string, error) {
	cursor = strings.TrimSpace(cursor)
	if cursor == "" {
		return nil, "", nil
	}
	raw, err := base64.RawURLEncoding.DecodeString(cursor)
	if err != nil {
		return nil, "", err
	}
	tsStr, id, ok := strings.Cut(string(raw), "|")
	if !ok {
		return nil, "", errors.New("invalid cursor")
	}
	t, err := time.Parse(time.RFC3339Nano, tsStr)
	if err != nil {
		return nil, "", err
	}
	if _, err := uuid.Parse(id); err != nil {
		return nil, "", err
	}
	return &t, id, nil
}

func truncateRunes(s string, maxLen int) string {
	r := []rune(s)
	if len(r) <= maxLen {
		return s
	}
	return string(r[:maxLen])
}

