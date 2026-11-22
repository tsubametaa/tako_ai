package conversations

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/response"
)

type ExportStudentDTO struct {
	UserID     string `json:"userId"`
	FullName   string `json:"fullName"`
	Username   string `json:"username,omitempty"`
	Identifier string `json:"identifier,omitempty"`
	Role       string `json:"role"`
	ClassName  string `json:"className,omitempty"`
	GradeLevel string `json:"gradeLevel,omitempty"`
	Persona    string `json:"persona,omitempty"`
}

type ExportTurnDTO struct {
	ExchangeID     string      `json:"exchangeId"`
	Mode           string      `json:"mode"`
	Question       string      `json:"question"`
	Answer         string      `json:"answer"`
	TrainingStatus string      `json:"trainingStatus,omitempty"`
	TrainingReason string      `json:"trainingReason,omitempty"`
	CreatedAt      time.Time   `json:"createdAt"`
	Sources        []SourceDTO `json:"sources"`
}

type ExportConversationDTO struct {
	ConversationID string           `json:"conversationId"`
	AISessionID    string           `json:"aiSessionId"`
	Title          string           `json:"title"`
	Student        ExportStudentDTO `json:"student"`
	ExchangeCount  int              `json:"exchangeCount"`
	MessageCount   int              `json:"messageCount"`
	CreatedAt      time.Time        `json:"createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt"`
	LastActivityAt time.Time        `json:"lastActivityAt"`
	Messages       []MessageDTO     `json:"messages"`
	Turns          []ExportTurnDTO  `json:"turns"`
}

type ExportSummaryDTO struct {
	TotalStudents      int `json:"totalStudents"`
	TotalConversations int `json:"totalConversations"`
	TotalExchanges     int `json:"totalExchanges"`
	TotalMessages      int `json:"totalMessages"`
}

type AdminChatExportDTO struct {
	ExportedAt    time.Time               `json:"exportedAt"`
	Scope         string                  `json:"scope"`
	Summary       ExportSummaryDTO        `json:"summary"`
	Conversations []ExportConversationDTO `json:"conversations"`
}

type exportProfileIdentity struct {
	FullName   string
	Username   string
	Identifier string
	Role       string
	ClassName  string
	GradeLevel string
}

func (h *AdminHandler) resolveExportProfiles(ctx context.Context, userIDs []string) map[string]exportProfileIdentity {
	result := make(map[string]exportProfileIdentity, len(userIDs))
	if h.db == nil || len(userIDs) == 0 {
		return result
	}

	rows, err := h.db.Query(ctx, `
		SELECT
			p.id::text,
			COALESCE(p.full_name, ''),
			COALESCE(cr.username, ''),
			COALESCE(p.identifier, ''),
			COALESCE(p.role, 'siswa'),
			COALESCE(en.class_name, ''),
			COALESCE(en.grade_level, '')
		FROM public.profiles p
		LEFT JOIN public.credentials cr ON cr.profile_id = p.id
		LEFT JOIN LATERAL (
			SELECT cl.name AS class_name, cl.grade_level
			FROM public.enrollments e
			JOIN public.classes cl ON cl.id = e.class_id
			WHERE e.student_id = p.id
			ORDER BY e.enrolled_at DESC NULLS LAST
			LIMIT 1
		) en ON TRUE
		WHERE p.id::text = ANY($1)`, userIDs,
	)
	if err != nil {
		return result
	}
	defer rows.Close()

	for rows.Next() {
		var uid string
		var ident exportProfileIdentity
		if rows.Scan(
			&uid,
			&ident.FullName,
			&ident.Username,
			&ident.Identifier,
			&ident.Role,
			&ident.ClassName,
			&ident.GradeLevel,
		) == nil {
			result[uid] = ident
		}
	}
	return result
}

func normalizeExportScope(raw string) string {
	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "all", "semua":
		return "all"
	default:
		return "students"
	}
}

func isNonStudentRole(role string) bool {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "guru", "teacher", "admin", "staff":
		return true
	default:
		return false
	}
}

func buildChatExport(
	docs []astraChatDoc,
	profiles map[string]exportProfileIdentity,
	scope string,
	exportedAt time.Time,
) AdminChatExportDTO {
	scope = normalizeExportScope(scope)

	personasByUser := make(map[string]string)
	type sessionBucket struct {
		id             string
		userID         string
		title          string
		createdAt      time.Time
		updatedAt      time.Time
		lastActivityAt time.Time
		hasTime        bool
		exchanges      map[string]astraChatDoc
	}
	buckets := make(map[string]*sessionBucket)

	for _, d := range docs {
		if d.Type == "persona" {
			uid := strings.TrimSpace(d.UserID)
			if uid != "" && strings.TrimSpace(d.Persona) != "" {
				personasByUser[uid] = strings.TrimSpace(d.Persona)
			}
			continue
		}
		if d.Type != "session" && d.Type != "exchange" {
			continue
		}

		sid := strings.TrimSpace(d.SessionID)
		if sid == "" {
			continue
		}
		t := parseTimeOrNow(d.CreatedAt, d.Timestamp)
		u := parseTimeOrNow(d.UpdatedAt, d.Timestamp)
		if u.Before(t) {
			u = t
		}

		b, exists := buckets[sid]
		if !exists {
			b = &sessionBucket{
				id:             sid,
				userID:         strings.TrimSpace(d.UserID),
				title:          "Percakapan Baru",
				createdAt:      t,
				updatedAt:      u,
				lastActivityAt: u,
				hasTime:        true,
				exchanges:      make(map[string]astraChatDoc),
			}
			buckets[sid] = b
		}
		if b.userID == "" && strings.TrimSpace(d.UserID) != "" {
			b.userID = strings.TrimSpace(d.UserID)
		}
		if !b.hasTime || t.Before(b.createdAt) {
			b.createdAt = t
			b.hasTime = true
		}
		if u.After(b.lastActivityAt) {
			b.lastActivityAt = u
			b.updatedAt = u
		}

		if d.Type == "session" && strings.TrimSpace(d.Title) != "" {
			b.title = strings.TrimSpace(d.Title)
		} else if d.Type == "exchange" {
			key := strings.TrimSpace(d.ID)
			if key == "" {
				key = fmt.Sprintf("ex_%d_%s", len(b.exchanges), d.CreatedAt)
			}
			if _, exists := b.exchanges[key]; !exists {
				b.exchanges[key] = d
			}
		}
	}

	conversations := make([]ExportConversationDTO, 0, len(buckets))
	studentSet := make(map[string]struct{})
	totalExchanges := 0
	totalMessages := 0

	for _, b := range buckets {
		if len(b.exchanges) == 0 {
			continue
		}

		prof, hasProf := profiles[b.userID]
		role := strings.TrimSpace(prof.Role)
		if role == "" {
			role = "siswa"
		}
		if scope == "students" && hasProf && isNonStudentRole(role) {
			continue
		}

		exList := make([]astraChatDoc, 0, len(b.exchanges))
		for _, ex := range b.exchanges {
			exList = append(exList, ex)
		}
		sort.Slice(exList, func(i, j int) bool {
			if exList[i].Timestamp != exList[j].Timestamp {
				return exList[i].Timestamp < exList[j].Timestamp
			}
			ti := parseTimeOrNow(exList[i].CreatedAt, exList[i].Timestamp)
			tj := parseTimeOrNow(exList[j].CreatedAt, exList[j].Timestamp)
			if !ti.Equal(tj) {
				return ti.Before(tj)
			}
			return exList[i].ID < exList[j].ID
		})

		title := b.title
		if (title == "" || title == "Percakapan Baru") && strings.TrimSpace(exList[0].Question) != "" {
			title = truncateRunes(strings.TrimSpace(exList[0].Question), 60)
		}

		messages := make([]MessageDTO, 0, len(exList)*2)
		turns := make([]ExportTurnDTO, 0, len(exList))

		for _, ex := range exList {
			t := parseTimeOrNow(ex.CreatedAt, ex.Timestamp)
			sources := mapAstraSources(ex.Sources)
			mode := strings.TrimSpace(ex.Mode)
			if mode == "" {
				mode = "umum"
			}

			messages = append(messages,
				MessageDTO{
					ID:              ex.ID + ":user",
					ConversationID:  b.id,
					ClientRequestID: ex.ID,
					Role:            "user",
					Content:         ex.Question,
					CreatedAt:       t,
					Status:          "completed",
					Sources:         []SourceDTO{},
				},
				MessageDTO{
					ID:              ex.ID + ":assistant",
					ConversationID:  b.id,
					ClientRequestID: ex.ID,
					Role:            "assistant",
					Content:         ex.Answer,
					CreatedAt:       t.Add(time.Millisecond),
					Status:          "completed",
					Sources:         sources,
				},
			)
			turns = append(turns, ExportTurnDTO{
				ExchangeID:     ex.ID,
				Mode:           mode,
				Question:       ex.Question,
				Answer:         ex.Answer,
				TrainingStatus: strings.TrimSpace(ex.TrainingStatus),
				TrainingReason: strings.TrimSpace(ex.TrainingReason),
				CreatedAt:      t,
				Sources:        sources,
			})
		}

		fullName := strings.TrimSpace(prof.FullName)
		if fullName == "" {
			fullName = b.userID
		}

		if b.userID != "" {
			studentSet[b.userID] = struct{}{}
		}
		totalExchanges += len(turns)
		totalMessages += len(messages)

		conversations = append(conversations, ExportConversationDTO{
			ConversationID: b.id,
			AISessionID:    b.id,
			Title:          title,
			Student: ExportStudentDTO{
				UserID:     b.userID,
				FullName:   fullName,
				Username:   prof.Username,
				Identifier: prof.Identifier,
				Role:       role,
				ClassName:  prof.ClassName,
				GradeLevel: prof.GradeLevel,
				Persona:    personasByUser[b.userID],
			},
			ExchangeCount:  len(turns),
			MessageCount:   len(messages),
			CreatedAt:      b.createdAt,
			UpdatedAt:      b.updatedAt,
			LastActivityAt: b.lastActivityAt,
			Messages:       messages,
			Turns:          turns,
		})
	}

	sort.Slice(conversations, func(i, j int) bool {
		if !conversations[i].LastActivityAt.Equal(conversations[j].LastActivityAt) {
			return conversations[i].LastActivityAt.After(conversations[j].LastActivityAt)
		}
		return conversations[i].ConversationID < conversations[j].ConversationID
	})

	return AdminChatExportDTO{
		ExportedAt: exportedAt.UTC(),
		Scope:      scope,
		Summary: ExportSummaryDTO{
			TotalStudents:      len(studentSet),
			TotalConversations: len(conversations),
			TotalExchanges:     totalExchanges,
			TotalMessages:      totalMessages,
		},
		Conversations: conversations,
	}
}

func (h *AdminHandler) ExportChats(c *gin.Context) {
	scope := normalizeExportScope(c.Query("scope"))
	filterUserID := strings.TrimSpace(c.Query("user_id"))

	var docs []astraChatDoc
	if h.astra != nil && h.astra.IsConfigured() {
		filter := map[string]any{
			"type": map[string]any{"$in": []string{"session", "exchange", "persona"}},
		}
		if filterUserID != "" {
			filter["user_id"] = filterUserID
		}
		if err := h.astra.FindAll(c.Request.Context(), filter, nil, &docs); err != nil {
			response.InternalError(c, "Gagal mengekspor seluruh riwayat chat dari Astra DB.")
			return
		}
	}

	userIDSet := make(map[string]struct{})
	for _, d := range docs {
		if uid := strings.TrimSpace(d.UserID); uid != "" {
			userIDSet[uid] = struct{}{}
		}
	}
	uids := make([]string, 0, len(userIDSet))
	for uid := range userIDSet {
		uids = append(uids, uid)
	}
	profiles := h.resolveExportProfiles(c.Request.Context(), uids)

	now := time.Now().UTC()
	exportPayload := buildChatExport(docs, profiles, scope, now)

	raw, err := json.MarshalIndent(exportPayload, "", "  ")
	if err != nil {
		response.InternalError(c, "Gagal menyusun berkas JSON riwayat chat.")
		return
	}

	filename := fmt.Sprintf("tako-ai-chat-history-%s-%s.json", scope, now.Format("2006-01-02"))
	extraHeaders := map[string]string{
		"Content-Disposition": fmt.Sprintf(`attachment; filename="%s"`, filename),
		"Cache-Control":       "no-store",
	}
	c.DataFromReader(
		http.StatusOK,
		int64(len(raw)),
		"application/json; charset=utf-8",
		bytes.NewReader(raw),
		extraHeaders,
	)
}
