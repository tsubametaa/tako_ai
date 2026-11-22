package auth

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindClassByUserID(ctx context.Context, userID string) (string, string) {
	rec := AccountRecord{ID: userID}
	r.populateClassInfo(ctx, &rec)
	return rec.ClassName, rec.GradeLevel
}

func (r *Repository) FindByIdentifier(ctx context.Context, identifier string) (*AccountRecord, error) {
	const customQuery = `
		SELECT p.id::text, p.full_name, p.role, COALESCE(p.identifier, ''), c.username, c.password_hash
		FROM public.credentials c
		JOIN public.profiles p ON p.id = c.profile_id
		WHERE LOWER(c.username) = LOWER($1)
		   OR LOWER(COALESCE(p.identifier, '')) = LOWER($1)
		   OR LOWER(p.full_name) = LOWER($1)
		LIMIT 1`

	var rec AccountRecord
	err := r.db.QueryRow(ctx, customQuery, identifier).Scan(
		&rec.ID,
		&rec.FullName,
		&rec.Role,
		&rec.Identifier,
		&rec.Username,
		&rec.PasswordHash,
	)
	if err == nil {
		rec.Role = normalizeRole(rec.Role, rec.Username)
		r.populateClassInfo(ctx, &rec)
		return &rec, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	const supabaseAuthQuery = `
		SELECT
			u.id::text,
			COALESCE(
				NULLIF(p.full_name, ''),
				NULLIF(u.raw_user_meta_data->>'full_name', ''),
				NULLIF(u.raw_user_meta_data->>'display_name', ''),
				NULLIF(u.raw_user_meta_data->>'name', ''),
				NULLIF(split_part(COALESCE(u.email, ''), '@', 1), ''),
				'Pengguna KKA'
			) AS full_name,
			COALESCE(
				NULLIF(p.role, ''),
				NULLIF(u.raw_user_meta_data->>'role', ''),
				NULLIF(u.raw_app_meta_data->>'role', ''),
				'siswa'
			) AS role,
			COALESCE(p.identifier, u.raw_user_meta_data->>'identifier', ''),
			COALESCE(NULLIF(u.email, ''), NULLIF(u.raw_user_meta_data->>'username', ''), u.id::text),
			COALESCE(u.encrypted_password, '')
		FROM auth.users u
		LEFT JOIN public.profiles p ON p.id = u.id
		WHERE LOWER(COALESCE(u.email, '')) = LOWER($1)
		   OR LOWER(split_part(COALESCE(u.email, ''), '@', 1)) = LOWER($1)
		   OR LOWER(COALESCE(u.raw_user_meta_data->>'username', '')) = LOWER($1)
		   OR LOWER(COALESCE(u.raw_user_meta_data->>'identifier', '')) = LOWER($1)
		   OR LOWER(COALESCE(p.identifier, '')) = LOWER($1)
		LIMIT 1`

	err = r.db.QueryRow(ctx, supabaseAuthQuery, identifier).Scan(
		&rec.ID,
		&rec.FullName,
		&rec.Role,
		&rec.Identifier,
		&rec.Username,
		&rec.PasswordHash,
	)
	if err != nil {
		return nil, err
	}

	rec.Role = normalizeRole(rec.Role, rec.Username)

	_, _ = r.db.Exec(ctx, `
		INSERT INTO public.profiles (id, full_name, role, identifier)
		VALUES ($1::uuid, $2, $3, NULLIF($4, ''))
		ON CONFLICT (id) DO UPDATE SET
			full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name)`,
		rec.ID, rec.FullName, rec.Role, rec.Identifier,
	)

	r.populateClassInfo(ctx, &rec)
	return &rec, nil
}

func (r *Repository) populateClassInfo(ctx context.Context, rec *AccountRecord) {
	if rec == nil || rec.ID == "" {
		return
	}

	// 1. Cek kelas siswa dari tabel public.enrollments -> public.classes
	err := r.db.QueryRow(ctx, `
		SELECT COALESCE(cl.name, ''), COALESCE(cl.grade_level, '')
		FROM public.enrollments e
		JOIN public.classes cl ON cl.id = e.class_id
		WHERE e.student_id = $1::uuid
		ORDER BY e.enrolled_at DESC NULLS LAST
		LIMIT 1`, rec.ID,
	).Scan(&rec.ClassName, &rec.GradeLevel)
	if err == nil && rec.ClassName != "" {
		return
	}

	// 2. Fallback: cek kelas siswa dari public.group_members -> public.classes
	err = r.db.QueryRow(ctx, `
		SELECT COALESCE(cl.name, ''), COALESCE(cl.grade_level, '')
		FROM public.group_members gm
		JOIN public.classes cl ON cl.id = gm.class_id
		WHERE gm.student_id = $1::uuid
		ORDER BY gm.joined_at DESC NULLS LAST
		LIMIT 1`, rec.ID,
	).Scan(&rec.ClassName, &rec.GradeLevel)
	if err == nil && rec.ClassName != "" {
		return
	}

	// 3. Fallback untuk guru: cek dari public.teaching_assignments atau wali kelas (homeroom_teacher_id)
	rows, err := r.db.Query(ctx, `
		SELECT DISTINCT cl.name, COALESCE(cl.grade_level, '')
		FROM public.classes cl
		LEFT JOIN public.teaching_assignments ta ON ta.class_id = cl.id
		WHERE ta.teacher_id = $1::uuid OR cl.homeroom_teacher_id = $1::uuid
		ORDER BY cl.name ASC
		LIMIT 5`, rec.ID,
	)
	if err != nil {
		return
	}
	defer rows.Close()

	names := make([]string, 0, 5)
	var grade string
	for rows.Next() {
		var n, g string
		if rows.Scan(&n, &g) == nil && strings.TrimSpace(n) != "" {
			names = append(names, strings.TrimSpace(n))
			if grade == "" && strings.TrimSpace(g) != "" {
				grade = strings.TrimSpace(g)
			}
		}
	}
	if len(names) > 0 {
		rec.ClassName = strings.Join(names, ", ")
		rec.GradeLevel = grade
	}
}

func normalizeRole(rawRole, username string) string {
	r := strings.ToLower(strings.TrimSpace(rawRole))
	if r == "guru" || r == "teacher" || r == "admin" {
		return "guru"
	}
	u := strings.ToLower(strings.TrimSpace(username))
	if strings.HasPrefix(u, "guru") || strings.HasPrefix(u, "admin") {
		return "guru"
	}
	return "siswa"
}
