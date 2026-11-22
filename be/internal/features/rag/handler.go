package rag

import (
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"

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

func (h *Handler) UploadUser(c *gin.Context) {
	h.handleUpload(c, "user", false)
}

func (h *Handler) UploadGlobal(c *gin.Context) {
	h.handleUpload(c, "global", true)
}

func (h *Handler) handleUpload(c *gin.Context, scope string, admin bool) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	mr, err := c.Request.MultipartReader()
	if err != nil {
		response.BadRequest(c, "INVALID_MULTIPART", "Request upload harus menggunakan multipart/form-data.")
		return
	}

	extra := make(map[string]string)
	for {
		part, err := mr.NextPart()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			var maxErr *http.MaxBytesError
			if errors.As(err, &maxErr) {
				response.JSONError(c, http.StatusRequestEntityTooLarge, "PAYLOAD_TOO_LARGE", "Ukuran file melebihi batas maksimal 20 MB.", false)
				return
			}
			response.BadRequest(c, "INVALID_MULTIPART", "Gagal membaca stream multipart.")
			return
		}

		if part.FormName() == "file" {
			out, err := h.svc.UploadDocument(c.Request.Context(), UploadInput{
				UserID:      claims.UserID,
				Scope:       scope,
				Admin:       admin,
				Filename:    part.FileName(),
				ContentType: part.Header.Get("Content-Type"),
				File:        part,
				ExtraFields: extra,
			})
			_ = part.Close()
			if err != nil {
				h.writeUploadError(c, err)
				return
			}
			c.JSON(http.StatusAccepted, out)
			return
		}

		valBytes, _ := io.ReadAll(io.LimitReader(part, 4096))
		_ = part.Close()
		name := strings.TrimSpace(part.FormName())
		if name != "" && name != "user_id" && name != "scope" {
			extra[name] = string(valBytes)
		}
	}

	response.Unprocessable(c, "VALIDATION_ERROR", "Field file wajib disertakan.")
}

func (h *Handler) writeUploadError(c *gin.Context, err error) {
	var maxErr *http.MaxBytesError
	switch {
	case errors.As(err, &maxErr):
		response.JSONError(c, http.StatusRequestEntityTooLarge, "PAYLOAD_TOO_LARGE", "Ukuran file melebihi batas maksimal 20 MB.", false)
	case errors.Is(err, ErrValidation):
		response.Unprocessable(c, "VALIDATION_ERROR", "Ekstensi file harus PDF, PNG, JPG, JPEG, WEBP, TXT, atau MD.")
	case errors.Is(err, ErrQueueFull):
		response.ServiceUnavailable(c, "OCR_BUSY", "Antrean pemrosesan dokumen sedang penuh, coba sebentar lagi.")
	default:
		aiclient.WriteHTTPError(c, err)
	}
}

func (h *Handler) GetJobStatus(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	out, err := h.svc.GetJobStatus(c.Request.Context(), claims.UserID, c.Param("jobId"))
	if err != nil {
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) ListUserDocuments(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	out, err := h.svc.ListUserDocuments(c.Request.Context(), claims.UserID)
	if err != nil {
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) DeleteUserDocument(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	out, err := h.svc.DeleteUserDocument(c.Request.Context(), claims.UserID, c.Param("docId"))
	if err != nil {
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) ListAutoLearned(c *gin.Context) {
	limit, _ := strconv.Atoi(c.Query("limit"))
	out, err := h.svc.ListAutoLearned(c.Request.Context(), limit)
	if err != nil {
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) DeleteAdminDocument(c *gin.Context) {
	out, err := h.svc.DeleteAdminDocument(c.Request.Context(), c.Param("docId"))
	if err != nil {
		aiclient.WriteHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, out)
}

