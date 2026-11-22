package persona

import (
	"context"
	"strings"
	"testing"
)

func TestCompileSummaryCustomPersonaNotOverridden(t *testing.T) {
	cfg := Config{
		Style:              "structured",
		Tone:               "friendly",
		IncludeCode:        true,
		CustomInstructions: `Tsundere seperti Nino Nakano, kalau tidak setuju bilang "Hmph!"`,
	}

	got := CompileSummary(cfg)
	if !strings.HasPrefix(got, "Tsundere seperti Nino Nakano") {
		t.Fatalf("expected custom persona at start of summary, got %q", got)
	}
	if strings.Contains(strings.ToLower(got), "ramah dan suportif") {
		t.Fatalf("custom persona should not be contradicted by default friendly tone, got %q", got)
	}
}

func TestCompileSummaryCustomWithAnalogyAppendsHint(t *testing.T) {
	cfg := Config{
		Style:              "analogy",
		Tone:               "friendly",
		IncludeCode:        true,
		CustomInstructions: "Gaya santai seperti teman sebaya",
	}

	got := CompileSummary(cfg)
	if !strings.HasPrefix(got, "Gaya santai seperti teman sebaya.") {
		t.Fatalf("expected custom persona first, got %q", got)
	}
	if !strings.Contains(got, "analogi sederhana") {
		t.Fatalf("expected analogy hint appended, got %q", got)
	}
}

func TestCompileSummaryDefaultWhenCustomEmpty(t *testing.T) {
	cfg := DefaultConfig()
	got := CompileSummary(cfg)
	if !strings.Contains(got, "nada ramah dan suportif") {
		t.Fatalf("expected default friendly summary when customInstructions empty, got %q", got)
	}
}

func TestServiceUpdatePersistsCompiledPersona(t *testing.T) {
	store := &fakePersonaStore{data: make(map[string]Config)}
	svc := NewService(store, nil, 0)

	updated, err := svc.Update(context.Background(), "user-1", Config{
		Style:              "structured",
		Tone:               "friendly",
		IncludeCode:        true,
		CustomInstructions: "  Gaya mentor tegas tapi suportif  ",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if updated.CustomInstructions != "Gaya mentor tegas tapi suportif" {
		t.Fatalf("expected trimmed customInstructions, got %q", updated.CustomInstructions)
	}
	if updated.CompiledPersona != "Gaya mentor tegas tapi suportif" {
		t.Fatalf("expected direct compiledPersona, got %q", updated.CompiledPersona)
	}
	if store.data["user-1"].CompiledPersona != updated.CompiledPersona {
		t.Fatalf("expected store to receive compiledPersona")
	}
}
