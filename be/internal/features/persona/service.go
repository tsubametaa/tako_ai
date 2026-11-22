package persona

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/jackc/pgx/v5"

	"kka-backend-go/internal/core/aiclient"
)

var (
	ErrValidation = errors.New("invalid persona configuration")
	ErrAIService  = errors.New("ai service error")
)

type Store interface {
	Get(ctx context.Context, userID string) (*Config, error)
	Upsert(ctx context.Context, userID string, cfg Config) error
	Delete(ctx context.Context, userID string) error
}

type Service struct {
	store     Store
	aiClient  *aiclient.Client
	aiTimeout time.Duration
}

func NewService(store Store, aiClient *aiclient.Client, aiTimeout time.Duration) *Service {
	return &Service{store: store, aiClient: aiClient, aiTimeout: aiTimeout}
}

func (s *Service) Get(ctx context.Context, userID string) (Config, error) {
	cfg, err := s.store.Get(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			def := DefaultConfig()
			def.CompiledPersona = CompileSummary(def)
			return def, nil
		}
		return Config{}, err
	}
	if strings.TrimSpace(cfg.CompiledPersona) == "" {
		cfg.CompiledPersona = CompileSummary(*cfg)
	}
	return *cfg, nil
}

func (s *Service) Update(ctx context.Context, userID string, req Config) (Config, error) {
	req.CustomInstructions = strings.TrimSpace(req.CustomInstructions)
	if !isValidStyle(req.Style) || !isValidTone(req.Tone) || utf8.RuneCountInString(req.CustomInstructions) > 350 {
		return Config{}, ErrValidation
	}

	compiled := CompileSummary(req)

	// Validasi dan sinkronisasi persona ke layanan AI kka_lab lebih dulu agar
	// aturan keamanan (prompt injection, pedagogy bypass) ditegakkan sebelum disimpan,
	// dan metadata UI di Astra DB tidak tertimpa oleh upsert polos dari kka_lab.
	if s.aiClient != nil {
		aiCtx, cancel := context.WithTimeout(ctx, s.aiTimeout)
		defer cancel()
		path := fmt.Sprintf("/api/users/%s/persona", url.PathEscape(userID))
		var aiRes struct {
			Saved   bool   `json:"saved"`
			Persona string `json:"persona"`
		}
		if err := s.aiClient.DoJSON(aiCtx, http.MethodPut, path, false, map[string]string{"persona": compiled}, &aiRes); err != nil {
			var upErr *aiclient.UpstreamError
			if errors.As(err, &upErr) && (upErr.StatusCode == http.StatusUnprocessableEntity || upErr.StatusCode == http.StatusBadRequest) {
				return Config{}, fmt.Errorf("%w: %w", ErrAIService, err)
			}
			slog.Warn("sync persona to kka_lab failed, persisting to Astra DB directly", "user_id", userID, "error", err)
		} else if strings.TrimSpace(aiRes.Persona) != "" {
			compiled = strings.TrimSpace(aiRes.Persona)
		}
	}

	req.CompiledPersona = compiled
	if err := s.store.Upsert(ctx, userID, req); err != nil {
		return Config{}, err
	}
	return req, nil
}

func (s *Service) Delete(ctx context.Context, userID string) error {
	if err := s.store.Delete(ctx, userID); err != nil {
		return err
	}
	if s.aiClient != nil {
		aiCtx, cancel := context.WithTimeout(ctx, s.aiTimeout)
		defer cancel()
		path := fmt.Sprintf("/api/users/%s/persona", url.PathEscape(userID))
		_ = s.aiClient.DoJSON(aiCtx, http.MethodDelete, path, false, nil, nil)
	}
	return nil
}

func CompileSummary(cfg Config) string {
	custom := strings.TrimSpace(cfg.CustomInstructions)
	styleHint := map[string]string{
		"structured": "Jelaskan bertahap langkah demi langkah.",
		"analogy":    "Gunakan analogi sederhana yang dekat dengan kehidupan sehari-hari.",
		"concise":    "Berikan penjelasan ringkas dan langsung ke inti materi.",
		"custom":     "",
	}[cfg.Style]

	// Jika siswa mengisi persona khusus (mis. gaya bicara / karakter tertentu),
	// prioritaskan instruksi siswa di depan tanpa menimpa nada bicaranya dengan
	// teks bawaan "ramah dan suportif" yang bisa bertabrakan dengan persona pilihan siswa.
	var summary string
	if custom != "" {
		summary = custom
		if styleHint != "" && cfg.Style != "structured" {
			summary = strings.TrimRight(summary, ". ") + ". " + styleHint
		}
	} else {
		toneText := "nada ramah dan suportif"
		if cfg.Tone == "formal" {
			toneText = "nada formal dan akademis"
		}
		codeText := "fokus pada konsep tanpa terlalu banyak kode"
		if cfg.IncludeCode {
			codeText = "sertakan contoh kode atau pseudocode bila relevan"
		}
		if styleHint == "" {
			styleHint = "Gunakan penjelasan yang mudah dipahami."
		}
		summary = fmt.Sprintf("%s Gunakan %s, serta %s.", styleHint, toneText, codeText)
	}

	runes := []rune(summary)
	if len(runes) > 500 {
		return string(runes[:500])
	}
	return summary
}

func isValidStyle(s string) bool {
	switch s {
	case "structured", "analogy", "concise", "custom":
		return true
	default:
		return false
	}
}

func isValidTone(t string) bool {
	return t == "friendly" || t == "formal"
}
