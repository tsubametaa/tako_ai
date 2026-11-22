package config

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                string
	GinMode             string
	FrontendOrigins     []string
	DatabaseURL         string
	RedisURL            string
	JWTSecret           string
	JWTTTL              time.Duration
	AIBaseURL           string
	AIInternalSecret    string
	RAGAdminSecret      string
	AstraEndpoint       string
	AstraToken          string
	AstraKeyspace       string
	AstraChatCollection string
	ChatRateLimitPerMin int
	MaxInflightChat     int
	ChatQueueWait       time.Duration
	ChatAITimeout       time.Duration
	MaxInflightRAG      int
	RAGQueueWait        time.Duration
	RAGUploadTimeout    time.Duration
	DefaultAITimeout    time.Duration
	MaxUploadBytes      int64
	SSEEventTTL         time.Duration
}

func Load() (Config, error) {
	_ = godotenv.Load()

	cfg := Config{
		Port:                getEnv("PORT", "5000"),
		GinMode:             getEnv("GIN_MODE", "release"),
		FrontendOrigins:     splitCSV(getEnv("FRONTEND_ORIGINS", "http://localhost:1234")),
		DatabaseURL:         strings.TrimSpace(os.Getenv("DATABASE_URL")),
		RedisURL:            getEnv("REDIS_URL", "redis://localhost:6379/0"),
		JWTSecret:           strings.TrimSpace(os.Getenv("JWT_SECRET")),
		JWTTTL:              getDuration("JWT_TTL", 24*time.Hour),
		AIBaseURL:           strings.TrimRight(strings.TrimSpace(os.Getenv("AI_BASE_URL")), "/"),
		AIInternalSecret:    strings.TrimSpace(os.Getenv("AI_INTERNAL_SECRET")),
		RAGAdminSecret:      strings.TrimSpace(os.Getenv("RAG_ADMIN_SECRET")),
		AstraEndpoint:       strings.TrimRight(strings.TrimSpace(os.Getenv("ASTRA_DB_API_ENDPOINT")), "/"),
		AstraToken:          strings.TrimSpace(os.Getenv("ASTRA_DB_APPLICATION_TOKEN")),
		AstraKeyspace:       getEnv("ASTRA_DB_KEYSPACE", "rag"),
		AstraChatCollection: getEnv("ASTRA_DB_CHAT_COLLECTION", "chat_history"),
		ChatRateLimitPerMin: getInt("CHAT_RATE_LIMIT_PER_MIN", 15),
		MaxInflightChat:     getInt("MAX_INFLIGHT_CHAT", 35),
		ChatQueueWait:       getDuration("CHAT_QUEUE_WAIT", 5*time.Second),
		ChatAITimeout:       getDuration("CHAT_AI_TIMEOUT", 90*time.Second),
		MaxInflightRAG:      getInt("MAX_INFLIGHT_RAG_UPLOAD", 3),
		RAGQueueWait:        getDuration("RAG_QUEUE_WAIT", 10*time.Second),
		RAGUploadTimeout:    getDuration("RAG_UPLOAD_TIMEOUT", 30*time.Second),
		DefaultAITimeout:    getDuration("DEFAULT_AI_TIMEOUT", 10*time.Second),
		MaxUploadBytes:      getInt64("MAX_UPLOAD_BYTES", 21*1024*1024),
		SSEEventTTL:         getDuration("SSE_EVENT_TTL", 30*time.Minute),
	}

	if cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}
	if len(cfg.JWTSecret) < 16 {
		return Config{}, errors.New("JWT_SECRET must be at least 16 characters")
	}
	if cfg.AIBaseURL == "" {
		return Config{}, errors.New("AI_BASE_URL is required")
	}
	if cfg.AIInternalSecret == "" {
		return Config{}, errors.New("AI_INTERNAL_SECRET is required")
	}
	return cfg, nil
}

func getEnv(key, fallback string) string {
	if val := strings.TrimSpace(os.Getenv(key)); val != "" {
		return val
	}
	return fallback
}

func getInt(key string, fallback int) int {
	val, err := strconv.Atoi(strings.TrimSpace(os.Getenv(key)))
	if err != nil || val <= 0 {
		return fallback
	}
	return val
}

func getInt64(key string, fallback int64) int64 {
	val, err := strconv.ParseInt(strings.TrimSpace(os.Getenv(key)), 10, 64)
	if err != nil || val <= 0 {
		return fallback
	}
	return val
}

func getDuration(key string, fallback time.Duration) time.Duration {
	val, err := time.ParseDuration(strings.TrimSpace(os.Getenv(key)))
	if err != nil || val <= 0 {
		return fallback
	}
	return val
}

func splitCSV(raw string) []string {
	parts := strings.Split(raw, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if trimmed := strings.TrimSpace(p); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}

