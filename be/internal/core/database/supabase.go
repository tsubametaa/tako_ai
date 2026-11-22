package database

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewSupabasePool(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("parse DATABASE_URL: %w", err)
	}

	if strings.Contains(databaseURL, ":6543/") {
		cfg.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol
	} else if strings.Contains(databaseURL, "pooler.supabase.com") {
		cfg.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeExec
	}

	cfg.MaxConns = 15
	cfg.MinConns = 2
	cfg.MaxConnLifetime = 30 * time.Minute
	cfg.MaxConnIdleTime = 5 * time.Minute
	cfg.HealthCheckPeriod = 1 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("create pgxpool: %w", err)
	}

	pingCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("supabase ping failed: %w", err)
	}

	return pool, nil
}

// CleanupLegacyChatTables removes conversations, messages, generations, and user_personas
// from Supabase because all chat history and persona data belong in DataStax Astra DB.
func CleanupLegacyChatTables(ctx context.Context, pool *pgxpool.Pool) error {
	cleanCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	stmts := []string{
		`DROP TABLE IF EXISTS public.generations CASCADE`,
		`DROP TABLE IF EXISTS public.messages CASCADE`,
		`DROP TABLE IF EXISTS public.conversations CASCADE`,
		`DROP TABLE IF EXISTS public.user_personas CASCADE`,
	}
	for _, stmt := range stmts {
		if _, err := pool.Exec(cleanCtx, stmt); err != nil {
			return fmt.Errorf("drop legacy chat table: %w", err)
		}
	}
	return nil
}
