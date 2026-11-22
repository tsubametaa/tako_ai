package conversations

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"kka-backend-go/internal/core/middleware"
)

type fakeConvStore struct {
	items map[string]ConversationDTO
	byCC  map[string]string
}

func newFakeConvStore() *fakeConvStore {
	return &fakeConvStore{items: make(map[string]ConversationDTO), byCC: make(map[string]string)}
}

func (f *fakeConvStore) List(_ context.Context, _, _ string, _ *time.Time, _ string, _ int) ([]ConversationDTO, error) {
	out := make([]ConversationDTO, 0, len(f.items))
	for _, c := range f.items {
		out = append(out, c)
	}
	return out, nil
}

func (f *fakeConvStore) CreateIdempotent(_ context.Context, userID, clientConvID, title string) (ConversationDTO, bool, error) {
	key := userID + ":" + clientConvID
	if id, ok := f.byCC[key]; ok {
		return f.items[id], false, nil
	}
	now := time.Now().UTC()
	conv := ConversationDTO{ID: uuid.NewString(), Title: title, CreatedAt: now, UpdatedAt: now, LastActivityAt: now}
	f.items[conv.ID] = conv
	f.byCC[key] = conv.ID
	return conv, true, nil
}

func (f *fakeConvStore) GetOwned(_ context.Context, _, convID string) (*ConversationDTO, error) {
	c, ok := f.items[convID]
	if !ok {
		return nil, pgx.ErrNoRows
	}
	return &c, nil
}

func (f *fakeConvStore) Rename(_ context.Context, _, convID, title string) (*ConversationDTO, error) {
	c, ok := f.items[convID]
	if !ok {
		return nil, pgx.ErrNoRows
	}
	c.Title = title
	f.items[convID] = c
	return &c, nil
}

func (f *fakeConvStore) Delete(_ context.Context, _, convID string) (string, bool, error) {
	if _, ok := f.items[convID]; !ok {
		return "", false, nil
	}
	delete(f.items, convID)
	return "", true, nil
}

func (f *fakeConvStore) ListMessages(_ context.Context, _ string, _ *time.Time, _ string, _ int) ([]MessageDTO, error) {
	return []MessageDTO{}, nil
}

func (f *fakeConvStore) GetActiveGeneration(_ context.Context, _ string) (*GenerationDTO, error) {
	return nil, pgx.ErrNoRows
}

func (f *fakeConvStore) FindRequest(_ context.Context, _, _, _ string) (*RequestLookupDTO, error) {
	return nil, pgx.ErrNoRows
}

func TestConversationIdempotentCreateAndRename(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-jwt-secret-key-at-least-32-chars"
	token, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{UserID: uuid.NewString(), Role: "siswa"})

	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), NewHandler(NewService(newFakeConvStore(), nil)))

	clientID := uuid.NewString()
	body := `{"clientConversationId":"` + clientID + `","title":"Belajar Regresi"}`

	req := httptest.NewRequest(http.MethodPost, "/api/v1/conversations", strings.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}

	var first ConversationDTO
	_ = json.Unmarshal(rec.Body.Bytes(), &first)

	req = httptest.NewRequest(http.MethodPost, "/api/v1/conversations", strings.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on repeat idempotent create, got %d", rec.Code)
	}

	var second ConversationDTO
	_ = json.Unmarshal(rec.Body.Bytes(), &second)
	if first.ID != second.ID {
		t.Fatalf("expected same conversation ID, got %s vs %s", first.ID, second.ID)
	}

	req = httptest.NewRequest(http.MethodPatch, "/api/v1/conversations/"+first.ID, strings.NewReader(`{"title":"Judul Baru"}`))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on rename, got %d", rec.Code)
	}
}

