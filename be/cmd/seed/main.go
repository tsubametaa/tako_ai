package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"kka-backend-go/internal/core/astradb"
	"kka-backend-go/internal/core/config"
	"kka-backend-go/internal/core/database"
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	cfg, err := config.Load()
	if err != nil {
		slog.Error("gagal membaca konfigurasi .env", "error", err)
		os.Exit(1)
	}

	ctx := context.Background()
	pool, err := database.NewSupabasePool(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("gagal terhubung ke Supabase", "error", err)
		os.Exit(1)
	}
	defer pool.Close()

	if err := database.CleanupLegacyChatTables(ctx, pool); err != nil {
		slog.Error("gagal menghapus tabel chat dari Supabase", "error", err)
		os.Exit(1)
	}

	fmt.Println("BERHASIL: Tabel conversations, messages, generations, dan user_personas telah dihapus dari Supabase!")

	astra := astradb.NewClient(cfg.AstraEndpoint, cfg.AstraToken, cfg.AstraKeyspace, cfg.AstraChatCollection)
	if astra.IsConfigured() {
		var docs []map[string]any
		if err := astra.Find(ctx, map[string]any{}, nil, 5, &docs); err != nil {
			fmt.Printf("Astra DB check error: %v\n", err)
		} else {
			fmt.Printf("BERHASIL TERHUBUNG KE ASTRA DB (koleksi %s.%s, ditemukan %d sampel dokumen)!\n", cfg.AstraKeyspace, cfg.AstraChatCollection, len(docs))
		}
	}
}
