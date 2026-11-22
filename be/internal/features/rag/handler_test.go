package rag

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/middleware"
)

func TestRAGUploadForcesScopeAndAdminRBAC(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var seenScope, seenUserID, seenAdminHdr string
	aiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		seenAdminHdr = r.Header.Get("X-Admin-Key")
		if err := r.ParseMultipartForm(1 << 20); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		seenScope = r.FormValue("scope")
		seenUserID = r.FormValue("user_id")
		w.WriteHeader(http.StatusAccepted)
		_, _ = w.Write([]byte(`{"job_id":"ocr_job_1","status":"queued"}`))
	}))
	defer aiSrv.Close()

	aiClient := aiclient.NewClient(aiSrv.URL, "secret-key", "admin-secret")
	svc := NewService(aiClient, 2, time.Second, 5*time.Second, 5*time.Second)

	secret := "test-jwt-secret-key-at-least-32-chars"
	siswaID := uuid.NewString()
	siswaTok, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{UserID: siswaID, Role: "siswa"})
	guruID := uuid.NewString()
	guruTok, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{UserID: guruID, Role: "guru"})

	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), middleware.RequireRole("guru"), middleware.BodyLimit(1<<20), NewHandler(svc))

	makeUploadReq := func(path, tok, filename string) *http.Request {
		var buf bytes.Buffer
		mw := multipart.NewWriter(&buf)
		_ = mw.WriteField("user_id", "spoofed-user")
		_ = mw.WriteField("scope", "global")
		fw, _ := mw.CreateFormFile("file", filename)
		_, _ = fw.Write([]byte("sample pdf bytes"))
		_ = mw.Close()

		req := httptest.NewRequest(http.MethodPost, path, &buf)
		req.Header.Set("Authorization", "Bearer "+tok)
		req.Header.Set("Content-Type", mw.FormDataContentType())
		return req
	}

	// Siswa upload forces scope=user, real user_id, and NO X-Admin-Key.
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, makeUploadReq("/api/v1/rag/documents", siswaTok, "catatan.pdf"))
	if rec.Code != http.StatusAccepted || seenScope != "user" || seenUserID != siswaID || seenAdminHdr != "" {
		t.Fatalf("unexpected student upload result code=%d scope=%s uid=%s admin=%q", rec.Code, seenScope, seenUserID, seenAdminHdr)
	}

	// Siswa cannot hit admin upload.
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, makeUploadReq("/api/v1/admin/rag/documents", siswaTok, "modul.pdf"))
	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for student on admin upload, got %d", rec.Code)
	}

	// Guru hits admin upload with scope=global + X-Admin-Key.
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, makeUploadReq("/api/v1/admin/rag/documents", guruTok, "modul.pdf"))
	if rec.Code != http.StatusAccepted || seenScope != "global" || seenAdminHdr != "admin-secret" {
		t.Fatalf("unexpected teacher upload result code=%d scope=%s admin=%q", rec.Code, seenScope, seenAdminHdr)
	}

	// Reject disallowed file extensions.
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, makeUploadReq("/api/v1/rag/documents", siswaTok, "malware.exe"))
	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422 for .exe upload, got %d", rec.Code)
	}
}

