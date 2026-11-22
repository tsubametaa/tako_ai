package persona

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

func (h *Handler) Get(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	cfg, err := h.svc.Get(c.Request.Context(), claims.UserID)
	if err != nil {
		response.InternalError(c, "Gagal memuat preferensi persona.")
		return
	}
	c.JSON(http.StatusOK, cfg)
}

func (h *Handler) Update(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	var req Config
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_JSON", "Format JSON persona tidak valid.")
		return
	}

	updated, err := h.svc.Update(c.Request.Context(), claims.UserID, req)
	if err != nil {
		if errors.Is(err, ErrValidation) {
			response.Unprocessable(c, "VALIDATION_ERROR", "Pilihan style/tone tidak valid atau instruksi melebihi 350 karakter.")
			return
		}
		if errors.Is(err, ErrAIService) {
			aiclient.WriteHTTPError(c, err)
			return
		}
		response.InternalError(c, "Gagal menyimpan preferensi persona.")
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *Handler) Delete(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	if err := h.svc.Delete(c.Request.Context(), claims.UserID); err != nil {
		if errors.Is(err, ErrAIService) {
			aiclient.WriteHTTPError(c, err)
			return
		}
		response.InternalError(c, "Gagal menghapus preferensi persona.")
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
