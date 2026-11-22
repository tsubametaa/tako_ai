package conversations

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, authMW gin.HandlerFunc, h *Handler) {
	group := v1.Group("/conversations", authMW)
	group.GET("", h.List)
	group.POST("", h.Create)
	group.PATCH("/:id", h.Rename)
	group.DELETE("/:id", h.Delete)
	group.GET("/:id/messages", h.Messages)
	group.GET("/:id/requests/:clientRequestId", h.LookupRequest)
}

