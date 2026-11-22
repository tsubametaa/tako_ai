package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TestJWTAuthAndRoleEnforcement(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "super-secret-jwt-key-minimum-32-chars"

	r := gin.New()
	r.Use(RequestID())
	r.GET("/me", RequireAuth(secret, nil), func(c *gin.Context) {
		claims, _ := ClaimsFromContext(c)
		c.JSON(http.StatusOK, gin.H{"user_id": claims.UserID, "role": claims.Role})
	})
	r.POST("/admin", RequireAuth(secret, nil), RequireRole("guru"), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	req := httptest.NewRequest(http.MethodGet, "/me", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 without token, got %d", rec.Code)
	}

	siswaToken, _, err := SignToken(secret, time.Hour, CustomClaims{
		UserID:     "u-1",
		Role:       "siswa",
		FullName:   "Budi",
		Username:   "budi.x",
		Identifier: "12345",
	})
	if err != nil {
		t.Fatalf("sign token: %v", err)
	}

	req = httptest.NewRequest(http.MethodGet, "/me", nil)
	req.Header.Set("Authorization", "Bearer "+siswaToken)
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK || rec.Header().Get(RequestIDHeader) == "" {
		t.Fatalf("expected 200 with X-Request-ID, got %d", rec.Code)
	}

	req = httptest.NewRequest(http.MethodPost, "/admin", nil)
	req.Header.Set("Authorization", "Bearer "+siswaToken)
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for siswa on guru route, got %d", rec.Code)
	}

	guruToken, _, _ := SignToken(secret, time.Hour, CustomClaims{UserID: "g-1", Role: "guru", FullName: "Bu Sari", Username: "sari"})
	req = httptest.NewRequest(http.MethodPost, "/admin", nil)
	req.Header.Set("Authorization", "Bearer "+guruToken)
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 for guru, got %d", rec.Code)
	}
}

func TestBodyLimitRejectsLargePayload(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/upload", BodyLimit(10), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	req := httptest.NewRequest(http.MethodPost, "/upload", strings.NewReader("0123456789abcdef"))
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("expected 413, got %d", rec.Code)
	}
}

