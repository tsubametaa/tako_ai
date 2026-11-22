package students

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrNotFound       = errors.New("student not found")
	ErrUsernameExists = errors.New("username already exists")
	ErrInvalidClass   = errors.New("class not found")
)

type Store interface {
	ListClasses(ctx context.Context) ([]ClassOptionDTO, error)
	ListStudents(ctx context.Context, query, classID string, page, pageSize int) ([]StudentDTO, int, error)
	CreateStudent(ctx context.Context, req CreateStudentRequest) (*StudentDTO, error)
	UpdateStudent(ctx context.Context, id string, req UpdateStudentRequest) (*StudentDTO, error)
	DeleteStudent(ctx context.Context, id string) error
}

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) ListClasses(ctx context.Context) ([]ClassOptionDTO, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id::text, COALESCE(name, ''), COALESCE(grade_level, '')
		FROM public.classes
		ORDER BY name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	classes := make([]ClassOptionDTO, 0)
	for rows.Next() {
		var c ClassOptionDTO
		if err := rows.Scan(&c.ID, &c.Name, &c.GradeLevel); err != nil {
			return nil, err
		}
		classes = append(classes, c)
	}
	return classes, rows.Err()
}

func (r *Repository) ListStudents(ctx context.Context, query, classID string, page, pageSize int) ([]StudentDTO, int, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 15
	}
	offset := (page - 1) * pageSize
	qLower := strings.ToLower(strings.TrimSpace(query))
	classFilter := strings.TrimSpace(classID)

	const baseFromWhere = `
		FROM public.profiles p
		LEFT JOIN public.credentials cr ON cr.profile_id = p.id
		LEFT JOIN LATERAL (
			SELECT cl.id AS class_id, cl.name AS class_name, cl.grade_level
			FROM public.enrollments e
			JOIN public.classes cl ON cl.id = e.class_id
			WHERE e.student_id = p.id
			ORDER BY e.enrolled_at DESC NULLS LAST
			LIMIT 1
		) en ON TRUE
		WHERE LOWER(COALESCE(p.role, '')) IN ('siswa', 'student')
		  AND ($2::text = '' OR COALESCE(en.class_id::text, '') = $2::text)
		  AND (
			$1::text = ''
			OR LOWER(COALESCE(p.full_name, '')) LIKE '%' || $1::text || '%'
			OR LOWER(COALESCE(cr.username, '')) LIKE '%' || $1::text || '%'
			OR LOWER(COALESCE(p.identifier, '')) LIKE '%' || $1::text || '%'
			OR LOWER(COALESCE(en.class_name, '')) LIKE '%' || $1::text || '%'
		  )`

	var totalItems int
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) `+baseFromWhere, qLower, classFilter).Scan(&totalItems); err != nil {
		return nil, 0, err
	}
	if totalItems == 0 {
		return []StudentDTO{}, 0, nil
	}

	rows, err := r.db.Query(ctx, `
		SELECT
			p.id::text,
			COALESCE(p.full_name, ''),
			COALESCE(cr.username, ''),
			COALESCE(p.identifier, ''),
			COALESCE(p.role, 'siswa'),
			COALESCE(en.class_id::text, ''),
			COALESCE(en.class_name, ''),
			COALESCE(en.grade_level, '')
		`+baseFromWhere+`
		ORDER BY LOWER(COALESCE(p.full_name, '')) ASC, p.id ASC
		LIMIT $3 OFFSET $4`,
		qLower, classFilter, pageSize, offset,
	)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]StudentDTO, 0, pageSize)
	for rows.Next() {
		var s StudentDTO
		if err := rows.Scan(
			&s.ID,
			&s.FullName,
			&s.Username,
			&s.Identifier,
			&s.Role,
			&s.ClassID,
			&s.ClassName,
			&s.GradeLevel,
		); err != nil {
			return nil, 0, err
		}
		items = append(items, s)
	}
	return items, totalItems, rows.Err()
}

func (r *Repository) detectStudentRoleValue(ctx context.Context, tx pgx.Tx) string {
	var existingRole string
	err := tx.QueryRow(ctx, `
		SELECT role
		FROM public.profiles
		WHERE LOWER(COALESCE(role, '')) IN ('siswa', 'student')
		LIMIT 1`).Scan(&existingRole)
	if err == nil && strings.TrimSpace(existingRole) != "" {
		return existingRole
	}
	return "siswa"
}

func (r *Repository) getStudentByIDTx(ctx context.Context, tx pgx.Tx, id string) (*StudentDTO, error) {
	var s StudentDTO
	err := tx.QueryRow(ctx, `
		SELECT
			p.id::text,
			COALESCE(p.full_name, ''),
			COALESCE(cr.username, ''),
			COALESCE(p.identifier, ''),
			COALESCE(p.role, 'siswa'),
			COALESCE(en.class_id::text, ''),
			COALESCE(en.class_name, ''),
			COALESCE(en.grade_level, '')
		FROM public.profiles p
		LEFT JOIN public.credentials cr ON cr.profile_id = p.id
		LEFT JOIN LATERAL (
			SELECT cl.id AS class_id, cl.name AS class_name, cl.grade_level
			FROM public.enrollments e
			JOIN public.classes cl ON cl.id = e.class_id
			WHERE e.student_id = p.id
			ORDER BY e.enrolled_at DESC NULLS LAST
			LIMIT 1
		) en ON TRUE
		WHERE p.id = $1::uuid
		  AND LOWER(COALESCE(p.role, '')) IN ('siswa', 'student')
		LIMIT 1`, id,
	).Scan(
		&s.ID,
		&s.FullName,
		&s.Username,
		&s.Identifier,
		&s.Role,
		&s.ClassID,
		&s.ClassName,
		&s.GradeLevel,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &s, nil
}

func (r *Repository) CreateStudent(ctx context.Context, req CreateStudentRequest) (*StudentDTO, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var dupCount int
	if err := tx.QueryRow(ctx, `
		SELECT COUNT(*) FROM public.credentials WHERE LOWER(username) = LOWER($1)`,
		req.Username,
	).Scan(&dupCount); err != nil {
		return nil, err
	}
	if dupCount > 0 {
		return nil, ErrUsernameExists
	}

	if req.ClassID != "" {
		if err := ensureClassExists(ctx, tx, req.ClassID); err != nil {
			return nil, err
		}
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	studentID := uuid.NewString()
	roleVal := r.detectStudentRoleValue(ctx, tx)

	_, err = tx.Exec(ctx, `
		INSERT INTO public.profiles (id, full_name, role, identifier)
		VALUES ($1::uuid, $2, $3, NULLIF($4, ''))`,
		studentID, req.FullName, roleVal, req.Identifier,
	)
	if err != nil {
		return nil, mapPgError(err)
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO public.credentials (profile_id, username, password_hash)
		VALUES ($1::uuid, $2, $3)`,
		studentID, req.Username, string(hash),
	)
	if err != nil {
		return nil, mapPgError(err)
	}

	if req.ClassID != "" {
		_, err = tx.Exec(ctx, `
			INSERT INTO public.enrollments (student_id, class_id)
			VALUES ($1::uuid, $2::uuid)`,
			studentID, req.ClassID,
		)
		if err != nil {
			return nil, mapPgError(err)
		}
	}

	created, err := r.getStudentByIDTx(ctx, tx, studentID)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return created, nil
}

func (r *Repository) UpdateStudent(ctx context.Context, id string, req UpdateStudentRequest) (*StudentDTO, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, ErrNotFound
	}

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	if _, err := r.getStudentByIDTx(ctx, tx, id); err != nil {
		return nil, err
	}

	var dupCount int
	if err := tx.QueryRow(ctx, `
		SELECT COUNT(*) FROM public.credentials
		WHERE LOWER(username) = LOWER($1) AND profile_id <> $2::uuid`,
		req.Username, id,
	).Scan(&dupCount); err != nil {
		return nil, err
	}
	if dupCount > 0 {
		return nil, ErrUsernameExists
	}

	if req.ClassID != "" {
		if err := ensureClassExists(ctx, tx, req.ClassID); err != nil {
			return nil, err
		}
	}

	if _, err := tx.Exec(ctx, `
		UPDATE public.profiles
		SET full_name = $1, identifier = NULLIF($2, '')
		WHERE id = $3::uuid`,
		req.FullName, req.Identifier, id,
	); err != nil {
		return nil, mapPgError(err)
	}

	var credExists bool
	if err := tx.QueryRow(ctx, `
		SELECT EXISTS(SELECT 1 FROM public.credentials WHERE profile_id = $1::uuid)`, id,
	).Scan(&credExists); err != nil {
		return nil, err
	}

	if req.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		if credExists {
			_, err = tx.Exec(ctx, `
				UPDATE public.credentials
				SET username = $1, password_hash = $2
				WHERE profile_id = $3::uuid`,
				req.Username, string(hash), id,
			)
		} else {
			_, err = tx.Exec(ctx, `
				INSERT INTO public.credentials (profile_id, username, password_hash)
				VALUES ($1::uuid, $2, $3)`,
				id, req.Username, string(hash),
			)
		}
		if err != nil {
			return nil, mapPgError(err)
		}
	} else if credExists {
		if _, err := tx.Exec(ctx, `
			UPDATE public.credentials
			SET username = $1
			WHERE profile_id = $2::uuid`,
			req.Username, id,
		); err != nil {
			return nil, mapPgError(err)
		}
	}

	if _, err := tx.Exec(ctx, `DELETE FROM public.enrollments WHERE student_id = $1::uuid`, id); err != nil {
		return nil, err
	}
	if req.ClassID != "" {
		if _, err := tx.Exec(ctx, `
			INSERT INTO public.enrollments (student_id, class_id)
			VALUES ($1::uuid, $2::uuid)`,
			id, req.ClassID,
		); err != nil {
			return nil, mapPgError(err)
		}
	}

	updated, err := r.getStudentByIDTx(ctx, tx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return updated, nil
}

func (r *Repository) DeleteStudent(ctx context.Context, id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return ErrNotFound
	}

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	if _, err := r.getStudentByIDTx(ctx, tx, id); err != nil {
		return err
	}

	// Safe cleanup across dependent school tables if present
	_, _ = tx.Exec(ctx, `SAVEPOINT sp_group_members`)
	if _, err := tx.Exec(ctx, `DELETE FROM public.group_members WHERE student_id = $1::uuid`, id); err != nil {
		_, _ = tx.Exec(ctx, `ROLLBACK TO SAVEPOINT sp_group_members`)
	}
	_, _ = tx.Exec(ctx, `RELEASE SAVEPOINT sp_group_members`)

	if _, err := tx.Exec(ctx, `DELETE FROM public.enrollments WHERE student_id = $1::uuid`, id); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, `DELETE FROM public.credentials WHERE profile_id = $1::uuid`, id); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, `DELETE FROM public.profiles WHERE id = $1::uuid`, id); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func ensureClassExists(ctx context.Context, tx pgx.Tx, classID string) error {
	if _, err := uuid.Parse(classID); err != nil {
		return ErrInvalidClass
	}
	var exists bool
	if err := tx.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM public.classes WHERE id = $1::uuid)`, classID).Scan(&exists); err != nil {
		return err
	}
	if !exists {
		return ErrInvalidClass
	}
	return nil
}

func mapPgError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return ErrUsernameExists
	}
	return err
}
