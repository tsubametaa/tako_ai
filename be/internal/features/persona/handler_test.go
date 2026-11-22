package persona

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/middleware"
)

type fakePersonaStore struct {
	data map[string]Config
}

func (f *fakePersonaStore) Get(_ context.Context, userID string) (*Config, error) {
	c, ok := f.data[userID]
	if !ok {
		return nil, pgx.ErrNoRows
	}
	return &c, nil
}

func (f *fakePersonaStore) Upsert(_ context.Context, userID string, cfg Config) error {
	f.data[userID] = cfg
	return nil
}

func (f *fakePersonaStore) Delete(_ context.Context, userID string) error {
	delete(f.data, userID)
	return nil
}

func TestPersonaGetPutDeleteSync(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var seenSummary string
	aiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			raw, _ := io.ReadAll(r.Body)
			var body map[string]string
			_ = json.Unmarshal(raw, &body)
			seenSummary = body["persona"]
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer aiSrv.Close()

	store := &fakePersonaStore{data: make(map[string]Config)}
	svc := NewService(store, aiclient.NewClient(aiSrv.URL, "sec", ""), 5*time.Second)

	secret := "test-jwt-secret-key-at-least-32-chars"
	userID := uuid.NewString()
	tok, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{UserID: userID, Role: "siswa"})

	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), NewHandler(svc))

	req := httptest.NewRequest(http.MethodGet, "/api/v1/persona", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK || !strings.Contains(rec.Body.String(), `"structured"`) {
		t.Fatalf("expected default persona on first GET, got %d %s", rec.Code, rec.Body.String())
	}

	req = httptest.NewRequest(http.MethodPut, "/api/v1/persona", strings.NewReader(`{"style":"analogy","tone":"formal","includeCode":false,"customInstructions":"Beri contoh soal latihan"}`))
	req.Header.Set("Authorization", "Bearer "+tok)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on PUT, got %d %s", rec.Code, rec.Body.String())
	}
	if seenSummary == "" || utf8.RuneCountInString(seenSummary) > 500 {
		t.Fatalf("unexpected compiled persona summary: len=%d val=%q", utf8.RuneCountInString(seenSummary), seenSummary)
	}
	if store.data[userID].Style != "analogy" {
		t.Fatalf("persona not persisted in store")
	}
}

