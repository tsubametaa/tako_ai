package aiclient

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
)

func TestDoJSONHeadersAndCircuitBreaker(t *testing.T) {
	var calls atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-API-Key") != "secret-1" {
			t.Fatalf("missing X-API-Key: %q", r.Header.Get("X-API-Key"))
		}
		if r.Header.Get("X-Request-ID") != "req-123" {
			t.Fatalf("missing X-Request-ID: %q", r.Header.Get("X-Request-ID"))
		}
		if calls.Add(1) <= 5 {
			w.WriteHeader(http.StatusInternalServerError)
			_, _ = w.Write([]byte(`{"detail":"boom"}`))
			return
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer srv.Close()

	client := NewClient(srv.URL, "secret-1", "admin-1")
	ctx := WithRequestID(context.Background(), "req-123")

	for i := range 5 {
		err := client.DoJSON(ctx, http.MethodPost, "/api/chat", false, map[string]string{"q": "hi"}, nil)
		if err == nil {
			t.Fatalf("expected error on attempt %d", i+1)
		}
	}

	err := client.DoJSON(ctx, http.MethodPost, "/api/chat", false, map[string]string{"q": "hi"}, nil)
	if !errors.Is(err, ErrCircuitOpen) {
		t.Fatalf("expected ErrCircuitOpen, got %v", err)
	}
	if calls.Load() != 5 {
		t.Fatalf("expected 5 upstream calls before circuit opened, got %d", calls.Load())
	}
}

func TestDoJSONWithRetryOnlyRetriesTransientErrors(t *testing.T) {
	var attempts atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		n := attempts.Add(1)
		if n < 3 {
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"done"}`))
	}))
	defer srv.Close()

	client := NewClient(srv.URL, "secret-1", "")
	var out map[string]string
	if err := client.DoJSONWithRetry(context.Background(), "/api/rag/jobs/123", false, &out); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if attempts.Load() != 3 || out["status"] != "done" {
		t.Fatalf("unexpected attempts=%d out=%v", attempts.Load(), out)
	}
}

func TestProxyMultipartStreaming(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Admin-Key") != "admin-secret" {
			t.Fatalf("expected X-Admin-Key header")
		}
		if err := r.ParseMultipartForm(1 << 20); err != nil {
			t.Fatalf("parse multipart: %v", err)
		}
		if r.FormValue("user_id") != "usr-1" || r.FormValue("scope") != "global" {
			t.Fatalf("unexpected form fields: user_id=%s scope=%s", r.FormValue("user_id"), r.FormValue("scope"))
		}
		f, hdr, err := r.FormFile("file")
		if err != nil {
			t.Fatalf("form file: %v", err)
		}
		defer f.Close()
		raw, _ := io.ReadAll(f)
		if hdr.Filename != "modul.pdf" || string(raw) != "pdf-binary-content" {
			t.Fatalf("unexpected file filename=%s content=%q", hdr.Filename, string(raw))
		}
		w.WriteHeader(http.StatusAccepted)
		_, _ = w.Write([]byte(`{"job_id":"job_1"}`))
	}))
	defer srv.Close()

	client := NewClient(srv.URL, "secret-1", "admin-secret")
	var out map[string]any
	err := client.ProxyMultipart(
		context.Background(),
		"/api/rag/documents",
		true,
		"file",
		"modul.pdf",
		"application/pdf",
		strings.NewReader("pdf-binary-content"),
		map[string]string{"user_id": "usr-1", "scope": "global"},
		&out,
	)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out["job_id"] != "job_1" {
		t.Fatalf("unexpected out: %v", out)
	}
}

