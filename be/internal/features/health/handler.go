package health

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"kka-backend-go/internal/core/aiclient"
)

type Handler struct {
	db       *pgxpool.Pool
	rdb      *redis.Client
	aiClient *aiclient.Client
}

func NewHandler(db *pgxpool.Pool, rdb *redis.Client, aiClient *aiclient.Client) *Handler {
	return &Handler{db: db, rdb: rdb, aiClient: aiClient}
}

func (h *Handler) Check(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	components := gin.H{
		"supabase": "ok",
		"redis":    "ok",
		"ai":       "ok",
	}
	healthy := true

	if h.db == nil {
		components["supabase"] = "unconfigured"
		healthy = false
	} else if err := h.db.Ping(ctx); err != nil {
		components["supabase"] = "down"
		healthy = false
	}

	if h.rdb == nil {
		components["redis"] = "unconfigured"
		healthy = false
	} else if err := h.rdb.Ping(ctx).Err(); err != nil {
		components["redis"] = "down"
		healthy = false
	}

	if h.aiClient == nil {
		components["ai"] = "unconfigured"
		healthy = false
	} else if err := h.aiClient.DoJSON(ctx, http.MethodGet, "/api/health", false, nil, nil); err != nil {
		components["ai"] = "down"
		healthy = false
	}

	if !healthy {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":     "degraded",
			"components": components,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "ok",
		"components": components,
	})
}

