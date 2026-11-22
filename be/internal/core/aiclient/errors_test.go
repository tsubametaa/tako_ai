package aiclient

import (
	"net/http"
	"testing"
)

func TestParseUpstreamErrorExtractsPersonaDetailObject(t *testing.T) {
	body := []byte(`{"detail":{"reason":"persona_bypasses_pedagogy","message":"Persona tidak boleh meminta jawaban akhir tanpa proses berpikir."}}`)
	upErr := ParseUpstreamError(http.StatusUnprocessableEntity, body)
	if upErr.StatusCode != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422, got %d", upErr.StatusCode)
	}
	if upErr.Message != "Persona tidak boleh meminta jawaban akhir tanpa proses berpikir." {
		t.Fatalf("unexpected message: %q", upErr.Message)
	}
}
