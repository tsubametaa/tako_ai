package chat

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/middleware"
	"kka-backend-go/internal/core/response"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) SendMessage(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	var req SendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_JSON", "Format JSON pesan tidak valid.")
		return
	}

	turn, err := h.svc.PrepareTurn(c.Request.Context(), claims.UserID, claims.FullName, c.Param("id"), req)
	if err != nil {
		switch {
		case errors.Is(err, ErrValidation):
			response.Unprocessable(c, "VALIDATION_ERROR", "Pesan wajib 1-4000 karakter, clientRequestId harus UUID, dan mode harus umum/terstruktur.")
		case errors.Is(err, ErrNotFound):
			response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan.")
		case errors.Is(err, ErrActiveGeneration), errors.Is(err, ErrDuplicateRequest):
			response.Conflict(c, "GENERATION_ACTIVE", "Generasi lain sedang aktif atau permintaan sudah diproses.")
		case errors.Is(err, ErrQueueFull):
			response.ServiceUnavailable(c, "AI_BUSY", "Server AI sedang sibuk, coba beberapa detik lagi.")
		default:
			response.InternalError(c, "Gagal memulai pengiriman pesan.")
		}
		return
	}

	setSSEHeaders(c)
	h.svc.StreamTurn(c, turn)
}

func (h *Handler) StreamEvents(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	after := c.Query("after")
	if after == "" {
		after = c.GetHeader("Last-Event-ID")
	}

	err := h.svc.ReplayEvents(c, claims.UserID, c.Param("id"), after)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "GENERATION_NOT_FOUND", "Generasi tidak ditemukan.")
			return
		}
		response.InternalError(c, "Gagal melanjutkan stream generasi.")
	}
}

func (h *Handler) CancelGeneration(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	rec, err := h.svc.Cancel(c.Request.Context(), claims.UserID, c.Param("id"))
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "GENERATION_NOT_FOUND", "Generasi tidak ditemukan.")
			return
		}
		response.InternalError(c, "Gagal membatalkan generasi.")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"generationId": rec.ID,
		"status":       rec.Status,
	})
}

