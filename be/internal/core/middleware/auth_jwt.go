package middleware

import (
	"errors"
	"log/slog"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"

	"kka-backend-go/internal/core/response"
)

const claimsContextKey = "auth_claims"

type CustomClaims struct {
	UserID     string `json:"user_id"`
	Role       string `json:"role"`
	FullName   string `json:"full_name"`
	Username   string `json:"username"`
	Identifier string `json:"identifier"`
	ClassName  string `json:"class_name,omitempty"`
	GradeLevel string `json:"grade_level,omitempty"`
	jwt.RegisteredClaims
}

func BlacklistKey(jti string) string {
	return "jwt:blacklist:" + jti
}

func SignToken(secret string, ttl time.Duration, claims CustomClaims) (string, time.Time, error) {
	now := time.Now().UTC()
	exp := now.Add(ttl)

	claims.RegisteredClaims = jwt.RegisteredClaims{
		ID:        uuid.NewString(),
		Subject:   claims.UserID,
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(exp),
	}

	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := tok.SignedString([]byte(secret))
	if err != nil {
		return "", time.Time{}, err
	}
	return signed, exp, nil
}

func ParseToken(secret, tokenStr string) (*CustomClaims, error) {
	claims := &CustomClaims{}
	tok, err := jwt.ParseWithClaims(
		tokenStr,
		claims,
		func(t *jwt.Token) (any, error) {
			return []byte(secret), nil
		},
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
		jwt.WithExpirationRequired(),
	)
	if err != nil {
		return nil, err
	}
	if !tok.Valid || claims.UserID == "" {
		return nil, errors.New("invalid token claims")
	}
	return claims, nil
}

func RequireAuth(secret string, rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := extractBearer(c.GetHeader("Authorization"))
		if tokenStr == "" {
			response.Unauthorized(c, "Token autentikasi tidak ditemukan.")
			return
		}

		claims, err := ParseToken(secret, tokenStr)
		if err != nil {
			response.Unauthorized(c, "Sesi tidak valid atau sudah kedaluwarsa.")
			return
		}

		if rdb != nil && claims.ID != "" {
			exists, err := rdb.Exists(c.Request.Context(), BlacklistKey(claims.ID)).Result()
			if err != nil {
				slog.Warn("redis jwt blacklist check failed", "error", err, "request_id", response.RequestID(c))
			} else if exists > 0 {
				response.Unauthorized(c, "Sesi sudah berakhir, silakan login ulang.")
				return
			}
		}

		c.Set(claimsContextKey, claims)
		c.Next()
	}
}

func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, ok := ClaimsFromContext(c)
		if !ok || claims.Role != role {
			response.Forbidden(c, "Anda tidak memiliki izin untuk mengakses resource ini.")
			return
		}
		c.Next()
	}
}

func ClaimsFromContext(c *gin.Context) (*CustomClaims, bool) {
	val, exists := c.Get(claimsContextKey)
	if !exists {
		return nil, false
	}
	claims, ok := val.(*CustomClaims)
	return claims, ok && claims != nil
}

func extractBearer(header string) string {
	parts := strings.SplitN(strings.TrimSpace(header), " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return strings.TrimSpace(parts[1])
}

