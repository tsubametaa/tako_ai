package persona

import (
	"context"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"

	"kka-backend-go/internal/core/astradb"
)

type Repository struct {
	astra *astradb.Client
}

func NewRepository(astra *astradb.Client) *Repository {
	return &Repository{astra: astra}
}

type astraPersonaDoc struct {
	ID                 string `json:"_id"`
	Type               string `json:"type"`
	UserID             string `json:"user_id"`
	Persona            string `json:"persona"`
	Style              string `json:"style"`
	Tone               string `json:"tone"`
	IncludeCode        *bool  `json:"include_code"`
	CustomInstructions string `json:"custom_instructions"`
	UpdatedAt          string `json:"updated_at"`
}

func (r *Repository) Get(ctx context.Context, userID string) (*Config, error) {
	if r.astra == nil || !r.astra.IsConfigured() {
		return nil, pgx.ErrNoRows
	}

	var doc astraPersonaDoc
	found, err := r.astra.FindOne(ctx, map[string]any{
		"_id": "persona_" + userID,
	}, &doc)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, pgx.ErrNoRows
	}

	cfg := DefaultConfig()
	if isValidStyle(doc.Style) {
		cfg.Style = doc.Style
	}
	if isValidTone(doc.Tone) {
		cfg.Tone = doc.Tone
	}
	if doc.IncludeCode != nil {
		cfg.IncludeCode = *doc.IncludeCode
	}
	if strings.TrimSpace(doc.CustomInstructions) != "" {
		cfg.CustomInstructions = strings.TrimSpace(doc.CustomInstructions)
	} else if doc.Style == "" && strings.TrimSpace(doc.Persona) != "" {
		cfg.CustomInstructions = strings.TrimSpace(doc.Persona)
	}
	if strings.TrimSpace(doc.Persona) != "" {
		cfg.CompiledPersona = strings.TrimSpace(doc.Persona)
	}
	return &cfg, nil
}

func (r *Repository) Upsert(ctx context.Context, userID string, cfg Config) error {
	if r.astra == nil || !r.astra.IsConfigured() {
		return nil
	}

	summary := strings.TrimSpace(cfg.CompiledPersona)
	if summary == "" {
		summary = CompileSummary(cfg)
	}
	return r.astra.UpsertOne(
		ctx,
		map[string]any{"_id": "persona_" + userID},
		map[string]any{
			"type":                "persona",
			"user_id":             userID,
			"persona":             summary,
			"style":               cfg.Style,
			"tone":                cfg.Tone,
			"include_code":        cfg.IncludeCode,
			"custom_instructions": cfg.CustomInstructions,
			"updated_at":          time.Now().UTC().Format(time.RFC3339),
		},
	)
}

func (r *Repository) Delete(ctx context.Context, userID string) error {
	if r.astra == nil || !r.astra.IsConfigured() {
		return nil
	}
	return r.astra.DeleteOne(ctx, map[string]any{
		"_id": "persona_" + userID,
	})
}
