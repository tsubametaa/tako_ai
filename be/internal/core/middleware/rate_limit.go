package middleware

import (
	"fmt"
	"log/slog"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis_rate/v10"

	"kka-backend-go/internal/core/response"
)

func RateLimitPerUser(limiter *redis_rate.Limiter, perMinute int) gin.HandlerFunc {
	return func(c *gin.Context) {
		if limiter == nil || perMinute <= 0 {
			c.Next()
			return
		}

		key := c.ClientIP()
		if claims, ok := ClaimsFromContext(c); ok && claims.UserID != "" {
			key = claims.UserID
		}

		res, err := limiter.Allow(c.Request.Context(), "chat:user:"+key, redis_rate.PerMinute(perMinute))
		if err != nil {
			slog.Warn("rate limit check failed", "error", err, "request_id", response.RequestID(c))
			c.Next()
			return
		}

		if res.Allowed == 0 {
			waitSec := max(1, int(math.Ceil(res.RetryAfter.Seconds())))
			c.Header("Retry-After", strconv.Itoa(waitSec))
			response.JSONError(
				c,
				http.StatusTooManyRequests,
				"RATE_LIMITED",
				fmt.Sprintf("Terlalu banyak permintaan. Coba lagi dalam %d detik.", waitSec),
				true,
			)
			return
		}

		c.Next()
	}
}

