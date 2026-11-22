package memory

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/middleware"
)

func TestMemoryKnowledgeStripsSpoofedUserID(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var seenPath string
	var seenBody map[string]any
	aiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		seenPath = r.URL.Path
		raw, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(raw, &seenBody)
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"saved":true}`))
	}))
	defer aiSrv.Close()

	svc := NewService(aiclient.NewClient(aiSrv.URL, "sec", ""), 5*time.Second)
	secret := "test-jwt-secret-key-at-least-32-chars"
	userID := uuid.NewString()
	tok, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{UserID: userID, Role: "siswa"})

	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), NewHandler(svc))

	req := httptest.NewRequest(http.MethodPost, "/api/v1/memory/knowledge", strings.NewReader(`{"user_id":"attacker","fact":"Suka belajar Python"}`))
	req.Header.Set("Authorization", "Bearer "+tok)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK || seenPath != "/api/users/"+userID+"/knowledge" {
		t.Fatalf("unexpected code=%d path=%s", rec.Code, seenPath)
	}
	if _, leaked := seenBody["user_id"]; leaked {
		t.Fatalf("spoofed user_id should have been stripped")
	}
}

