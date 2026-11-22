package conversations

import (
	"context"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"kka-backend-go/internal/core/astradb"
	"kka-backend-go/internal/core/response"
)

type AdminConversationDTO struct {
	ID             string    `json:"id"`
	Title          string    `json:"title"`
	AISessionID    string    `json:"aiSessionId"`
	UserID         string    `json:"userId"`
	StudentName    string    `json:"studentName"`
	Username       string    `json:"username"`
	Identifier     string    `json:"identifier"`
	Role           string    `json:"role"`
	MessageCount   int       `json:"messageCount"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
	LastActivityAt time.Time `json:"lastActivityAt"`
}

type AdminListResponseDTO struct {
	Items []AdminConversationDTO `json:"items"`
}

type AdminMessagesResponseDTO struct {
	Conversation AdminConversationDTO `json:"conversation"`
	Items        []MessageDTO         `json:"items"`
}

type AdminHandler struct {
	db    *pgxpool.Pool
	astra *astradb.Client
}

func NewAdminHandler(db *pgxpool.Pool, astra *astradb.Client) *AdminHandler {
	return &AdminHandler{db: db, astra: astra}
}

func RegisterAdminRoutes(v1 *gin.RouterGroup, authMW, guruMW gin.HandlerFunc, h *AdminHandler) {
	admin := v1.Group("/admin/chats", authMW, guruMW)
	admin.GET("", h.ListChats)
	admin.GET("/analytics", h.GetAnalytics)
	admin.GET("/export", h.ExportChats)
	admin.GET("/:id/messages", h.GetChatMessages)
	admin.DELETE("/:id", h.DeleteChat)
	admin.DELETE("/:id/messages/:messageId", h.DeleteMessage)
}

type profileIdentity struct {
	FullName   string
	Username   string
	Identifier string
	Role       string
}

func (h *AdminHandler) resolveProfiles(ctx context.Context, userIDs []string) map[string]profileIdentity {
	result := make(map[string]profileIdentity, len(userIDs))
	if h.db == nil || len(userIDs) == 0 {
		return result
	}

	rows, err := h.db.Query(ctx, `
		SELECT
			p.id::text,
			p.full_name,
			COALESCE(cr.username, ''),
			COALESCE(p.identifier, ''),
			p.role
		FROM public.profiles p
		LEFT JOIN public.credentials cr ON cr.profile_id = p.id
		WHERE p.id::text = ANY($1)`, userIDs,
	)
	if err != nil {
		return result
	}
	defer rows.Close()

	for rows.Next() {
		var uid string
		var ident profileIdentity
		if rows.Scan(&uid, &ident.FullName, &ident.Username, &ident.Identifier, &ident.Role) == nil {
			result[uid] = ident
		}
	}
	return result
}

func (h *AdminHandler) ListChats(c *gin.Context) {
	if h.astra == nil || !h.astra.IsConfigured() {
		c.JSON(http.StatusOK, AdminListResponseDTO{Items: []AdminConversationDTO{}})
		return
	}

	limit, _ := strconv.Atoi(c.Query("limit"))
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	qLower := strings.ToLower(strings.TrimSpace(c.Query("q")))
	filterUserID := strings.TrimSpace(c.Query("user_id"))

	filter := map[string]any{
		"type": map[string]any{"$in": []string{"session", "exchange"}},
	}
	if filterUserID != "" {
		filter["user_id"] = filterUserID
	}

	var docs []astraChatDoc
	if err := h.astra.Find(c.Request.Context(), filter, map[string]any{"timestamp": -1}, 250, &docs); err != nil {
		response.InternalError(c, "Gagal memuat log percakapan dari Astra DB.")
		return
	}

	bySession := make(map[string]*AdminConversationDTO)
	userIDSet := make(map[string]struct{})

	for _, d := range docs {
		sid := strings.TrimSpace(d.SessionID)
		if sid == "" {
			continue
		}
		if d.UserID != "" {
			userIDSet[d.UserID] = struct{}{}
		}

		t := parseTimeOrNow(d.CreatedAt, d.Timestamp)
		u := parseTimeOrNow(d.UpdatedAt, d.Timestamp)
		if u.Before(t) {
			u = t
		}

		item, exists := bySession[sid]
		if !exists {
			item = &AdminConversationDTO{
				ID:             sid,
				Title:          "Percakapan Baru",
				AISessionID:    sid,
				UserID:         d.UserID,
				StudentName:    d.UserID,
				Role:           "siswa",
				CreatedAt:      t,
				UpdatedAt:      u,
				LastActivityAt: u,
			}
			bySession[sid] = item
		}

		if item.UserID == "" && d.UserID != "" {
			item.UserID = d.UserID
		}
		if t.Before(item.CreatedAt) {
			item.CreatedAt = t
		}
		if u.After(item.LastActivityAt) {
			item.LastActivityAt = u
			item.UpdatedAt = u
		}

		if d.Type == "session" && strings.TrimSpace(d.Title) != "" {
			item.Title = strings.TrimSpace(d.Title)
		} else if d.Type == "exchange" {
			item.MessageCount += 2
			if (item.Title == "" || item.Title == "Percakapan Baru") && strings.TrimSpace(d.Question) != "" {
				item.Title = truncateRunes(strings.TrimSpace(d.Question), 60)
			}
		}
	}

	uids := make([]string, 0, len(userIDSet))
	for uid := range userIDSet {
		uids = append(uids, uid)
	}
	profiles := h.resolveProfiles(c.Request.Context(), uids)

	items := make([]AdminConversationDTO, 0, len(bySession))
	for _, conv := range bySession {
		if prof, ok := profiles[conv.UserID]; ok {
			conv.StudentName = prof.FullName
			conv.Username = prof.Username
			conv.Identifier = prof.Identifier
			conv.Role = prof.Role
		}

		if qLower != "" {
			match := strings.Contains(strings.ToLower(conv.Title), qLower) ||
				strings.Contains(strings.ToLower(conv.StudentName), qLower) ||
				strings.Contains(strings.ToLower(conv.Username), qLower) ||
				strings.Contains(strings.ToLower(conv.Identifier), qLower)
			if !match {
				continue
			}
		}
		items = append(items, *conv)
	}

	sort.Slice(items, func(i, j int) bool {
		return items[i].LastActivityAt.After(items[j].LastActivityAt)
	})
	if len(items) > limit {
		items = items[:limit]
	}

	c.JSON(http.StatusOK, AdminListResponseDTO{Items: items})
}

func (h *AdminHandler) GetChatMessages(c *gin.Context) {
	sessionID := strings.TrimSpace(c.Param("id"))
	if sessionID == "" || h.astra == nil || !h.astra.IsConfigured() {
		response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan di Astra DB.")
		return
	}

	var docs []astraChatDoc
	err := h.astra.Find(
		c.Request.Context(),
		map[string]any{"session_id": sessionID},
		map[string]any{"timestamp": 1},
		150,
		&docs,
	)
	if err != nil {
		response.InternalError(c, "Gagal memuat detail percakapan dari Astra DB.")
		return
	}
	if len(docs) == 0 {
		response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan di Astra DB.")
		return
	}

	now := time.Now().UTC()
	conv := AdminConversationDTO{
		ID:             sessionID,
		Title:          "Percakapan",
		AISessionID:    sessionID,
		Role:           "siswa",
		CreatedAt:      now,
		UpdatedAt:      now,
		LastActivityAt: now,
	}

	exchanges := make([]astraChatDoc, 0, len(docs))
	for _, d := range docs {
		if conv.UserID == "" && d.UserID != "" {
			conv.UserID = d.UserID
		}
		if d.Type == "session" && strings.TrimSpace(d.Title) != "" {
			conv.Title = strings.TrimSpace(d.Title)
		} else if d.Type == "exchange" {
			exchanges = append(exchanges, d)
		}
	}

	sort.Slice(exchanges, func(i, j int) bool {
		return exchanges[i].Timestamp < exchanges[j].Timestamp
	})

	if conv.Title == "Percakapan" && len(exchanges) > 0 && strings.TrimSpace(exchanges[0].Question) != "" {
		conv.Title = truncateRunes(strings.TrimSpace(exchanges[0].Question), 60)
	}

	if conv.UserID != "" {
		profs := h.resolveProfiles(c.Request.Context(), []string{conv.UserID})
		if p, ok := profs[conv.UserID]; ok {
			conv.StudentName = p.FullName
			conv.Username = p.Username
			conv.Identifier = p.Identifier
			conv.Role = p.Role
		} else {
			conv.StudentName = conv.UserID
		}
	}

	messages := make([]MessageDTO, 0, len(exchanges)*2)
	for _, ex := range exchanges {
		t := parseTimeOrNow(ex.CreatedAt, ex.Timestamp)
		messages = append(messages,
			MessageDTO{
				ID:              ex.ID + ":user",
				ConversationID:  sessionID,
				ClientRequestID: ex.ID,
				Role:            "user",
				Content:         ex.Question,
				CreatedAt:       t,
				Status:          "completed",
				Sources:         []SourceDTO{},
			},
			MessageDTO{
				ID:              ex.ID + ":assistant",
				ConversationID:  sessionID,
				ClientRequestID: ex.ID,
				Role:            "assistant",
				Content:         ex.Answer,
				CreatedAt:       t.Add(time.Millisecond),
				Status:          "completed",
				Sources:         mapAstraSources(ex.Sources),
			},
		)
	}
	conv.MessageCount = len(messages)

	c.JSON(http.StatusOK, AdminMessagesResponseDTO{
		Conversation: conv,
		Items:        messages,
	})
}

func (h *AdminHandler) DeleteChat(c *gin.Context) {
	sessionID := strings.TrimSpace(c.Param("id"))
	if sessionID == "" || h.astra == nil || !h.astra.IsConfigured() {
		response.NotFound(c, "CONVERSATION_NOT_FOUND", "Percakapan tidak ditemukan.")
		return
	}

	if err := h.astra.DeleteMany(c.Request.Context(), map[string]any{"session_id": sessionID}); err != nil {
		response.InternalError(c, "Gagal menghapus sesi percakapan dari Astra DB.")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"deleted":         true,
		"conversationId":  sessionID,
		"aiSessionId":     sessionID,
		"aiSessionSynced": true,
	})
}

func (h *AdminHandler) DeleteMessage(c *gin.Context) {
	sessionID := strings.TrimSpace(c.Param("id"))
	rawMsgID := strings.TrimSpace(c.Param("messageId"))
	if sessionID == "" || rawMsgID == "" || h.astra == nil || !h.astra.IsConfigured() {
		response.NotFound(c, "MESSAGE_NOT_FOUND", "Pesan tidak ditemukan.")
		return
	}

	exchangeID := strings.TrimSuffix(strings.TrimSuffix(rawMsgID, ":user"), ":assistant")
	if err := h.astra.DeleteOne(c.Request.Context(), map[string]any{
		"_id":        exchangeID,
		"session_id": sessionID,
	}); err != nil {
		response.InternalError(c, "Gagal menghapus exchange pesan dari Astra DB.")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"deleted":        true,
		"conversationId": sessionID,
		"messageId":      rawMsgID,
	})
}
