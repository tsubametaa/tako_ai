package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis_rate/v10"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/astradb"
	"kka-backend-go/internal/core/cache"
	"kka-backend-go/internal/core/config"
	"kka-backend-go/internal/core/database"
	"kka-backend-go/internal/core/middleware"
	"kka-backend-go/internal/features/auth"
	"kka-backend-go/internal/features/chat"
	"kka-backend-go/internal/features/conversations"
	"kka-backend-go/internal/features/health"
	"kka-backend-go/internal/features/memory"
	"kka-backend-go/internal/features/persona"
	"kka-backend-go/internal/features/rag"
	"kka-backend-go/internal/features/students"
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	cfg, err := config.Load()
	if err != nil {
		slog.Error("invalid configuration", "error", err)
		os.Exit(1)
	}

	ctx := context.Background()
	dbPool, err := database.NewSupabasePool(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("failed to connect to Supabase", "error", err)
		os.Exit(1)
	}
	defer dbPool.Close()

	if err := database.CleanupLegacyChatTables(ctx, dbPool); err != nil {
		slog.Warn("cleanup legacy chat tables warning", "error", err)
	}

	var limiter *redis_rate.Limiter
	rdb, err := cache.NewRedisClient(ctx, cfg.RedisURL)
	if err != nil {
		slog.Warn("redis unavailable, continuing without redis cache and rate limiter", "error", err)
		rdb = nil
	} else {
		defer func() { _ = rdb.Close() }()
		limiter = cache.NewRateLimiter(rdb)
	}
	aiClient := aiclient.NewClient(cfg.AIBaseURL, cfg.AIInternalSecret, cfg.RAGAdminSecret)
	astraClient := astradb.NewClient(cfg.AstraEndpoint, cfg.AstraToken, cfg.AstraKeyspace, cfg.AstraChatCollection)

	gin.SetMode(cfg.GinMode)
	router := gin.New()
	router.ContextWithFallback = true
	router.HandleMethodNotAllowed = true
	router.Use(gin.Recovery(), middleware.RequestID(), middleware.CORS(cfg.FrontendOrigins))

	authMW := middleware.RequireAuth(cfg.JWTSecret, rdb)
	guruMW := middleware.RequireRole("guru")
	chatLimitMW := middleware.RateLimitPerUser(limiter, cfg.ChatRateLimitPerMin)
	jsonLimitMW := middleware.BodyLimit(1 * 1024 * 1024)
	uploadLimitMW := middleware.BodyLimit(cfg.MaxUploadBytes)

	v1 := router.Group("/api/v1")
	v1.Use(func(c *gin.Context) {
		if c.Request.Method == http.MethodPost && strings.HasSuffix(c.Request.URL.Path, "/rag/documents") {
			c.Next()
			return
		}
		jsonLimitMW(c)
	})

	apiIndexHandler := func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service": "TAKO AI Backend Gateway (Golang / Gin)",
			"version": "v1",
			"status":  "ok",
			"endpoints": gin.H{
				"health":        "/api/v1/health",
				"authLogin":     "POST /api/v1/auth/login",
				"authMe":        "GET /api/v1/auth/me",
				"conversations": "GET/POST /api/v1/conversations",
				"adminChats":    "GET/DELETE /api/v1/admin/chats",
				"adminStudents": "GET/POST/PUT/DELETE /api/v1/admin/students",
			},
		})
	}
	router.GET("/", apiIndexHandler)
	router.GET("/api", apiIndexHandler)
	v1.GET("", apiIndexHandler)
	v1.GET("/", apiIndexHandler)

	router.NoMethod(func(c *gin.Context) {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"error": gin.H{
				"code":      "METHOD_NOT_ALLOWED",
				"message":   "Metode HTTP tidak sesuai untuk endpoint ini.",
				"retryable": false,
			},
		})
	})

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":      "ROUTE_NOT_FOUND",
				"message":   "Endpoint API tidak ditemukan. Gunakan /api/v1/health untuk cek status server.",
				"retryable": false,
			},
		})
	})

	health.RegisterRoutes(v1, health.NewHandler(dbPool, rdb, aiClient))
	auth.RegisterRoutes(v1, authMW, auth.NewHandler(auth.NewService(auth.NewRepository(dbPool), rdb, cfg.JWTSecret, cfg.JWTTTL)))

	convRepo := conversations.NewRepository(astraClient)
	conversations.RegisterRoutes(v1, authMW, conversations.NewHandler(conversations.NewService(convRepo, rdb)))
	conversations.RegisterAdminRoutes(v1, authMW, guruMW, conversations.NewAdminHandler(dbPool, astraClient))
	students.RegisterAdminRoutes(v1, authMW, guruMW, students.NewHandler(students.NewRepository(dbPool)))

	chatSvc := chat.NewService(chat.NewRepository(astraClient), rdb, aiClient, cfg.MaxInflightChat, cfg.ChatQueueWait, cfg.ChatAITimeout, cfg.SSEEventTTL)
	chat.RegisterRoutes(v1, authMW, chatLimitMW, chat.NewHandler(chatSvc))

	ragSvc := rag.NewService(aiClient, cfg.MaxInflightRAG, cfg.RAGQueueWait, cfg.RAGUploadTimeout, cfg.DefaultAITimeout)
	rag.RegisterRoutes(v1, authMW, guruMW, uploadLimitMW, rag.NewHandler(ragSvc))

	personaSvc := persona.NewService(persona.NewRepository(astraClient), aiClient, cfg.DefaultAITimeout)
	persona.RegisterRoutes(v1, authMW, persona.NewHandler(personaSvc))

	memorySvc := memory.NewService(aiClient, cfg.DefaultAITimeout)
	memory.RegisterRoutes(v1, authMW, memory.NewHandler(memorySvc))

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	go func() {
		slog.Info("kka backend listening", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server error", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	slog.Info("shutting down gracefully")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("graceful shutdown failed", "error", err)
	}
}
