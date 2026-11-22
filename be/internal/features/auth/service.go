package auth

import (
	"context"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/argon2"
	"golang.org/x/crypto/bcrypt"

	"kka-backend-go/internal/core/middleware"
)

var (
	ErrValidation         = errors.New("validation failed")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AccountStore interface {
	FindByIdentifier(ctx context.Context, identifier string) (*AccountRecord, error)
}

type ClassLookupStore interface {
	FindClassByUserID(ctx context.Context, userID string) (string, string)
}

type Service struct {
	store     AccountStore
	rdb       *redis.Client
	jwtSecret string
	jwtTTL    time.Duration
}

func NewService(store AccountStore, rdb *redis.Client, jwtSecret string, jwtTTL time.Duration) *Service {
	return &Service{store: store, rdb: rdb, jwtSecret: jwtSecret, jwtTTL: jwtTTL}
}

func (s *Service) Login(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	id := strings.TrimSpace(req.Identifier)
	if len(id) < 3 || len(req.Password) < 4 {
		return nil, ErrValidation
	}

	acc, err := s.store.FindByIdentifier(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			slog.Warn("login failed: account not found in public.credentials or auth.users", "identifier", id)
			return nil, ErrInvalidCredentials
		}
		slog.Error("login failed: database query error", "identifier", id, "error", err)
		return nil, err
	}

	if !verifyPassword(acc.PasswordHash, req.Password) {
		slog.Warn("login failed: password mismatch", "identifier", id, "username", acc.Username)
		return nil, ErrInvalidCredentials
	}

	token, exp, err := middleware.SignToken(s.jwtSecret, s.jwtTTL, middleware.CustomClaims{
		UserID:     acc.ID,
		Role:       acc.Role,
		FullName:   acc.FullName,
		Username:   acc.Username,
		Identifier: acc.Identifier,
		ClassName:  acc.ClassName,
		GradeLevel: acc.GradeLevel,
	})
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken: token,
		TokenType:   "Bearer",
		ExpiresAt:   exp.UTC(),
		User: UserDTO{
			ID:          acc.ID,
			DisplayName: acc.FullName,
			Username:    acc.Username,
			Role:        acc.Role,
			Identifier:  acc.Identifier,
			ClassName:   acc.ClassName,
			GradeLevel:  acc.GradeLevel,
		},
	}, nil
}

func verifyPassword(storedHash, plainPassword string) bool {
	storedHash = strings.TrimSpace(storedHash)
	if storedHash == "" {
		return false
	}
	// 1. Bcrypt hash ($2a$, $2b$, $2y$) - dari Go bcrypt, Postgres pgcrypto bf, atau Supabase auth.users
	if strings.HasPrefix(storedHash, "$2a$") || strings.HasPrefix(storedHash, "$2b$") || strings.HasPrefix(storedHash, "$2y$") {
		return bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(plainPassword)) == nil
	}
	// 2. Argon2 hash ($argon2id$, $argon2i$) - dari DB versi sebelumnya
	if strings.HasPrefix(storedHash, "$argon2") {
		return verifyArgon2(storedHash, plainPassword)
	}
	// 3. Fallback jika password dimasukkan sebagai plain-text langsung melalui Supabase Table Editor
	return subtle.ConstantTimeCompare([]byte(storedHash), []byte(plainPassword)) == 1
}

func verifyArgon2(encodedHash, plainPassword string) bool {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false
	}
	variant := parts[1]
	var memory, iterations uint32
	var parallelism uint8
	if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &iterations, &parallelism); err != nil {
		return false
	}
	salt, err := decodeBase64Flexible(parts[4])
	if err != nil {
		return false
	}
	expectedHash, err := decodeBase64Flexible(parts[5])
	if err != nil || len(expectedHash) == 0 {
		return false
	}

	var computed []byte
	switch variant {
	case "argon2id":
		computed = argon2.IDKey([]byte(plainPassword), salt, iterations, memory, parallelism, uint32(len(expectedHash)))
	case "argon2i":
		computed = argon2.Key([]byte(plainPassword), salt, iterations, memory, parallelism, uint32(len(expectedHash)))
	default:
		return false
	}
	return subtle.ConstantTimeCompare(computed, expectedHash) == 1
}

func decodeBase64Flexible(s string) ([]byte, error) {
	if b, err := base64.RawStdEncoding.DecodeString(s); err == nil {
		return b, nil
	}
	return base64.StdEncoding.DecodeString(s)
}

func (s *Service) ResolveUserDTO(ctx context.Context, claims *middleware.CustomClaims) UserDTO {
	className := claims.ClassName
	gradeLevel := claims.GradeLevel
	if className == "" {
		if lookup, ok := s.store.(ClassLookupStore); ok {
			className, gradeLevel = lookup.FindClassByUserID(ctx, claims.UserID)
		}
	}
	return UserDTO{
		ID:          claims.UserID,
		DisplayName: claims.FullName,
		Username:    claims.Username,
		Role:        claims.Role,
		Identifier:  claims.Identifier,
		ClassName:   className,
		GradeLevel:  gradeLevel,
	}
}

func (s *Service) Logout(ctx context.Context, claims *middleware.CustomClaims) error {
	if s.rdb == nil || claims == nil || claims.ID == "" || claims.ExpiresAt == nil {
		return nil
	}
	ttl := time.Until(claims.ExpiresAt.Time)
	if ttl <= 0 {
		return nil
	}
	return s.rdb.Set(ctx, middleware.BlacklistKey(claims.ID), "1", ttl).Err()
}
