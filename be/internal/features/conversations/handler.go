package conversations

import (
	"errors"
	"net/http"
	"strconv"

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

func (h *Handler) List(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	limit, _ := strconv.Atoi(c.Query("limit"))
	res, err := h.svc.List(c.Request.Context(), claims.UserID, c.Query("q"), c.Query("cursor"), limit)
	if err != nil {
		if errors.Is(err, ErrValidation) {
			response.BadRequest(c, "INVALID_CURSOR", "Parameter cursor tidak valid.")
			return
		}
		response.InternalError(c, "Gagal memuat daftar percakapan.")
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *Handler) Create(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_JSON", "Format JSON tidak valid.")
		return
	}

	conv, created, err := h.svc.Create(c.Request.Context(), claims.UserID, req)
	if err != nil {
		if errors.Is(err, ErrValidation) {
			response.Unprocessable(c, "VALIDATION_ERROR", "clientConversationId harus berupa UUID yang valid.")
			return
		}
		response.InternalError(c, "Gagal membuat percakapan.")
		return
	}

	status := http.StatusOK
	if created {
		status = http.StatusCreated
	}
	c.JSON(status, conv)
}

func (h *Handler) Rename(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	var req RenameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_JSON", "Format JSON tidak valid.")
		return
	}

	conv, err := h.svc.Rename(c.Request.Context(), claims.UserID, c.Param("id"), req)
	if err != nil {
		switch {
		case errors.Is(err, ErrValidation):
			response.Unprocessable(c, "VALIDATION_ERROR", "Judul wajib diisi dan maksimal 100 karakter.")
		case errors.Is(err, ErrNotFound):
			response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan.")
		default:
			response.InternalError(c, "Gagal mengubah judul percakapan.")
		}
		return
	}
	c.JSON(http.StatusOK, conv)
}

func (h *Handler) Delete(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	if err := h.svc.Delete(c.Request.Context(), claims.UserID, c.Param("id")); err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan.")
			return
		}
		response.InternalError(c, "Gagal menghapus percakapan.")
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) Messages(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	limit, _ := strconv.Atoi(c.Query("limit"))
	page, err := h.svc.MessagesPage(c.Request.Context(), claims.UserID, c.Param("id"), c.Query("before"), limit)
	if err != nil {
		switch {
		case errors.Is(err, ErrValidation):
			response.BadRequest(c, "INVALID_CURSOR", "Parameter before tidak valid.")
		case errors.Is(err, ErrNotFound):
			response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan.")
		default:
			response.InternalError(c, "Gagal memuat riwayat pesan.")
		}
		return
	}
	c.JSON(http.StatusOK, page)
}

func (h *Handler) LookupRequest(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	res, err := h.svc.LookupRequest(c.Request.Context(), claims.UserID, c.Param("id"), c.Param("clientRequestId"))
	if err != nil {
		switch {
		case errors.Is(err, ErrValidation):
			response.Unprocessable(c, "VALIDATION_ERROR", "clientRequestId harus berupa UUID yang valid.")
		case errors.Is(err, ErrNotFound):
			response.NotFound(c, "REQUEST_NOT_FOUND", "Permintaan tidak ditemukan.")
		default:
			response.InternalError(c, "Gagal memeriksa status permintaan.")
		}
		return
	}
	c.JSON(http.StatusOK, res)
}

