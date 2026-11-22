package chat

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, authMW, chatRateLimitMW gin.HandlerFunc, h *Handler) {
	v1.POST("/conversations/:id/messages", authMW, chatRateLimitMW, h.SendMessage)

	gen := v1.Group("/generations", authMW)
	gen.GET("/:id/events", h.StreamEvents)
	gen.POST("/:id/cancel", h.CancelGeneration)
}

