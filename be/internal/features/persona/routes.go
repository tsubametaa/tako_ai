package persona

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, authMW gin.HandlerFunc, h *Handler) {
	group := v1.Group("/persona", authMW)
	group.GET("", h.Get)
	group.PUT("", h.Update)
	group.DELETE("", h.Delete)
}

