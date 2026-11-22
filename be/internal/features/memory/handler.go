package memory

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/middleware"
	"kka-backend-go/internal/core/response"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) AddKnowledge(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	var payload map[string]any
	if err := c.ShouldBindJSON(&payload); err != nil {
		response.BadRequest(c, "INVALID_JSON", "Format JSON pengetahuan tidak valid.")
		return
	}

	out, err := h.svc.AddKnowledge(c.Request.Context(), claims.UserID, payload)
	if err != nil {
		if errors.Is(err, ErrEmptyPayload) {
			response.Unprocessable(c, "VALIDATION_ERROR", "Data pengetahuan tidak boleh kosong.")
			return
		}
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) DeleteMemory(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	out, err := h.svc.DeleteMemory(c.Request.Context(), claims.UserID)
	if err != nil {
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

