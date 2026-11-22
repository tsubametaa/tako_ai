package auth

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/argon2"
	"golang.org/x/crypto/bcrypt"

	"kka-backend-go/internal/core/middleware"
)

type fakeAccountStore struct {
	accounts map[string]AccountRecord
}

func (f *fakeAccountStore) FindByIdentifier(_ context.Context, id string) (*AccountRecord, error) {
	rec, ok := f.accounts[id]
	if !ok {
		return nil, pgx.ErrNoRows
	}
	return &rec, nil
}

func TestLoginAndMeFlow(t *testing.T) {
	gin.SetMode(gin.TestMode)
	hash, _ := bcrypt.GenerateFromPassword([]byte("rahasia123"), bcrypt.MinCost)

	store := &fakeAccountStore{
		accounts: map[string]AccountRecord{
			"siswa.x01": {
				ID:           "11111111-1111-1111-1111-111111111111",
				FullName:     "Siswa Kelas X",
				Role:         "siswa",
				Identifier:   "NIS-9901",
				Username:     "siswa.x01",
				PasswordHash: string(hash),
			},
		},
	}

	secret := "test-jwt-secret-key-at-least-32-chars"
	svc := NewService(store, nil, secret, time.Hour)
	h := NewHandler(svc)

	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), h)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(`{"identifier":"siswa.x01","password":"wrong"}`))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for wrong password, got %d", rec.Code)
	}

	req = httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(`{"identifier":"siswa.x01","password":"rahasia123"}`))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on login, got %d: %s", rec.Code, rec.Body.String())
	}

	var loginResp LoginResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &loginResp); err != nil {
		t.Fatalf("decode login response: %v", err)
	}
	if loginResp.TokenType != "Bearer" || loginResp.User.Role != "siswa" || loginResp.AccessToken == "" {
		t.Fatalf("unexpected login response: %+v", loginResp)
	}

	req = httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+loginResp.AccessToken)
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on /me, got %d", rec.Code)
	}

	// Test Argon2id hash compatibility
	salt := []byte("1234567890abcdef")
	argonKey := argon2.IDKey([]byte("argonpass123"), salt, 1, 16*1024, 1, 32)
	argonHash := fmt.Sprintf(
		"$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		16*1024, 1, 1,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(argonKey),
	)
	store.accounts["guru.argon"] = AccountRecord{
		ID:           "22222222-2222-2222-2222-222222222222",
		FullName:     "Guru Argon",
		Role:         "guru",
		Identifier:   "NIP-20099",
		Username:     "guru.argon",
		PasswordHash: argonHash,
	}

	req = httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(`{"identifier":"guru.argon","password":"argonpass123"}`))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on argon2id login, got %d: %s", rec.Code, rec.Body.String())
	}
}

