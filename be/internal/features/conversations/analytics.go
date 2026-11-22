package conversations

import (
	"context"
	"math"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/response"
)

type AnalyticsSummaryDTO struct {
	TotalQuestions          int     `json:"totalQuestions"`
	PeriodQuestions         int     `json:"periodQuestions"`
	TotalConversations      int     `json:"totalConversations"`
	ActiveStudents          int     `json:"activeStudents"`
	TotalRegisteredStudents int     `json:"totalRegisteredStudents"`
	UmumCount               int     `json:"umumCount"`
	TerstrukturCount        int     `json:"terstrukturCount"`
	DeepThinkPercent        float64 `json:"deepThinkPercent"`
	TopClassName            string  `json:"topClassName"`
	TopTopicName            string  `json:"topTopicName"`
}

type DailyUsagePointDTO struct {
	Date           string `json:"date"`
	Label          string `json:"label"`
	Umum           int    `json:"umum"`
	Terstruktur    int    `json:"terstruktur"`
	Total          int    `json:"total"`
	ActiveStudents int    `json:"activeStudents"`
}

type ClassUsageDTO struct {
	ClassID            string  `json:"classId"`
	ClassName          string  `json:"className"`
	GradeLevel         string  `json:"gradeLevel"`
	RegisteredStudents int     `json:"registeredStudents"`
	ActiveStudents     int     `json:"activeStudents"`
	TotalQuestions     int     `json:"totalQuestions"`
	TotalConversations int     `json:"totalConversations"`
	UmumCount          int     `json:"umumCount"`
	TerstrukturCount   int     `json:"terstrukturCount"`
	SharePercent       float64 `json:"sharePercent"`
}

type TopicSummaryDTO struct {
	Topic            string   `json:"topic"`
	QuestionCount    int      `json:"questionCount"`
	SharePercent     float64  `json:"sharePercent"`
	StudentCount     int      `json:"studentCount"`
	TerstrukturCount int      `json:"terstrukturCount"`
	TopClasses       []string `json:"topClasses"`
	SampleQuestions  []string `json:"sampleQuestions"`
}

type AdminAnalyticsDTO struct {
	GeneratedAt time.Time            `json:"generatedAt"`
	Days        int                  `json:"days"`
	Scope       string               `json:"scope"`
	Summary     AnalyticsSummaryDTO  `json:"summary"`
	DailyUsage  []DailyUsagePointDTO `json:"dailyUsage"`
	ClassUsage  []ClassUsageDTO      `json:"classUsage"`
	TopTopics   []TopicSummaryDTO    `json:"topTopics"`
}

type analyticsClassRecord struct {
	ID                 string
	Name               string
	GradeLevel         string
	RegisteredStudents int
}

type analyticsStudentRecord struct {
	UserID     string
	Role       string
	ClassID    string
	ClassName  string
	GradeLevel string
}

var analyticsWIB = time.FixedZone("WIB", 7*3600)

func (h *AdminHandler) loadAnalyticsMetadata(ctx context.Context) ([]analyticsClassRecord, map[string]analyticsStudentRecord) {
	classes := make([]analyticsClassRecord, 0)
	profiles := make(map[string]analyticsStudentRecord)
	if h.db == nil {
		return classes, profiles
	}

	classRows, err := h.db.Query(ctx, `
		SELECT
			cl.id::text,
			COALESCE(cl.name, ''),
			COALESCE(cl.grade_level, ''),
			COUNT(DISTINCT CASE
				WHEN LOWER(COALESCE(p.role, '')) IN ('siswa', 'student') THEN e.student_id
			END) AS registered_students
		FROM public.classes cl
		LEFT JOIN public.enrollments e ON e.class_id = cl.id
		LEFT JOIN public.profiles p ON p.id = e.student_id
		GROUP BY cl.id, cl.name, cl.grade_level
		ORDER BY cl.name ASC`)
	if err == nil {
		defer classRows.Close()
		for classRows.Next() {
			var c analyticsClassRecord
			if classRows.Scan(&c.ID, &c.Name, &c.GradeLevel, &c.RegisteredStudents) == nil {
				classes = append(classes, c)
			}
		}
	}

	profRows, err := h.db.Query(ctx, `
		SELECT
			p.id::text,
			COALESCE(p.role, 'siswa'),
			COALESCE(en.class_id::text, ''),
			COALESCE(en.class_name, ''),
			COALESCE(en.grade_level, '')
		FROM public.profiles p
		LEFT JOIN LATERAL (
			SELECT cl.id AS class_id, cl.name AS class_name, cl.grade_level
			FROM public.enrollments e
			JOIN public.classes cl ON cl.id = e.class_id
			WHERE e.student_id = p.id
			ORDER BY e.enrolled_at DESC NULLS LAST
			LIMIT 1
		) en ON TRUE`)
	if err == nil {
		defer profRows.Close()
		for profRows.Next() {
			var rec analyticsStudentRecord
			if profRows.Scan(&rec.UserID, &rec.Role, &rec.ClassID, &rec.ClassName, &rec.GradeLevel) == nil {
				profiles[rec.UserID] = rec
			}
		}
	}

	return classes, profiles
}

func normalizeTopicLabel(raw string) string {
	s := strings.ToLower(strings.TrimSpace(raw))
	if s == "" || s == "materi tambahan" || s == "umum" || s == "general" {
		return ""
	}
	switch {
	case strings.Contains(s, "prompt"):
		return "Prompt Engineering"
	case strings.Contains(s, "machine learning") || strings.Contains(s, "supervised") || strings.Contains(s, "unsupervised") || strings.Contains(s, "klasifikasi") || strings.Contains(s, "regresi") || strings.Contains(s, "data latih") || strings.Contains(s, "overfitting"):
		return "Machine Learning"
	case strings.Contains(s, "komputasional") || strings.Contains(s, "algoritma") || strings.Contains(s, "dekomposisi") || strings.Contains(s, "abstraksi") || strings.Contains(s, "flowchart"):
		return "Berpikir Komputasional"
	case strings.Contains(s, "etika") || strings.Contains(s, "literasi") || strings.Contains(s, "privasi") || strings.Contains(s, "bias") || strings.Contains(s, "halusinasi"):
		return "Literasi & Etika AI"
	case strings.Contains(s, "perancangan") || strings.Contains(s, "arsitektur") || strings.Contains(s, "desain") || strings.Contains(s, "ui/ux") || strings.Contains(s, "rag"):
		return "Perancangan Sistem AI"
	case strings.Contains(s, "pemrograman") || strings.Contains(s, "python") || strings.Contains(s, "koding") || strings.Contains(s, "coding") || strings.Contains(s, "pseudocode"):
		return "Dasar Pemrograman"
	default:
		return strings.TrimSpace(raw)
	}
}

func classifyExchangeTopic(ex astraChatDoc) string {
	if len(ex.Sources) > 0 {
		counts := make(map[string]int)
		bestLabel := ""
		bestCount := 0
		for _, src := range ex.Sources {
			raw := strFromMap(src, "topic", "section", "title")
			label := normalizeTopicLabel(raw)
			if label == "" {
				continue
			}
			counts[label]++
			if counts[label] > bestCount {
				bestCount = counts[label]
				bestLabel = label
			}
		}
		if bestLabel != "" {
			return bestLabel
		}
	}

	q := strings.ToLower(strings.TrimSpace(ex.Question))
	switch {
	case strings.Contains(q, "prompt") || strings.Contains(q, "cot") || strings.Contains(q, "few-shot") || strings.Contains(q, "zero-shot") || strings.Contains(q, "pkto"):
		return "Prompt Engineering"
	case strings.Contains(q, "machine learning") || strings.Contains(q, "data latih") || strings.Contains(q, "data uji") || strings.Contains(q, "dataset") || strings.Contains(q, "latih") || strings.Contains(q, "overfitting") || strings.Contains(q, "model"):
		return "Machine Learning"
	case strings.Contains(q, "komputasional") || strings.Contains(q, "algoritma") || strings.Contains(q, "dekomposisi") || strings.Contains(q, "abstraksi") || strings.Contains(q, "pola") || strings.Contains(q, "langkah penyelesaian"):
		return "Berpikir Komputasional"
	case strings.Contains(q, "etika") || strings.Contains(q, "bobol") || strings.Contains(q, "nasa") || strings.Contains(q, "ilegal") || strings.Contains(q, "privasi") || strings.Contains(q, "hak cipta") || strings.Contains(q, "bias") || strings.Contains(q, "menilai informasi") || strings.Contains(q, "menggantikan pekerjaan") || strings.Contains(q, "profesor"):
		return "Literasi & Etika AI"
	case strings.Contains(q, "perancangan") || strings.Contains(q, "vibe design") || strings.Contains(q, "ui/ux") || strings.Contains(q, "desain") || strings.Contains(q, "rag") || strings.Contains(q, "sistem ai"):
		return "Perancangan Sistem AI"
	case strings.Contains(q, "python") || strings.Contains(q, "koding") || strings.Contains(q, "coding") || strings.Contains(q, "variabel") || strings.Contains(q, "fungsi") || strings.Contains(q, "loop") || strings.Contains(q, "pseudocode"):
		return "Dasar Pemrograman"
	default:
		return "Konsep KKA Umum"
	}
}

func formatDayLabelID(t time.Time) string {
	months := [...]string{"", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"}
	m := int(t.Month())
	if m < 1 || m > 12 {
		return t.Format("02/01")
	}
	return strconv.Itoa(t.Day()) + " " + months[m]
}

func roundOneDecimal(val float64) float64 {
	return math.Round(val*10) / 10
}

func buildChatAnalytics(
	docs []astraChatDoc,
	classes []analyticsClassRecord,
	profiles map[string]analyticsStudentRecord,
	days int,
	scope string,
	now time.Time,
) AdminAnalyticsDTO {
	if days != 7 && days != 30 {
		days = 14
	}
	scope = normalizeExportScope(scope)

	nowWIB := now.In(analyticsWIB)
	endDay := time.Date(nowWIB.Year(), nowWIB.Month(), nowWIB.Day(), 0, 0, 0, 0, analyticsWIB)
	startDay := endDay.AddDate(0, 0, -(days - 1))

	// Deduplicate exchanges by _id
	exByID := make(map[string]astraChatDoc)
	exchanges := make([]astraChatDoc, 0, len(docs))
	for _, d := range docs {
		if d.Type != "exchange" {
			continue
		}
		if d.ID != "" {
			if _, exists := exByID[d.ID]; exists {
				continue
			}
			exByID[d.ID] = d
		}
		exchanges = append(exchanges, d)
	}

	sort.Slice(exchanges, func(i, j int) bool {
		if exchanges[i].Timestamp != exchanges[j].Timestamp {
			return exchanges[i].Timestamp > exchanges[j].Timestamp
		}
		return parseTimeOrNow(exchanges[i].CreatedAt, exchanges[i].Timestamp).After(
			parseTimeOrNow(exchanges[j].CreatedAt, exchanges[j].Timestamp),
		)
	})

	type dailyBucket struct {
		umum        int
		terstruktur int
		students    map[string]struct{}
	}
	dailyMap := make(map[string]*dailyBucket, days)
	orderedDates := make([]time.Time, 0, days)
	for i := 0; i < days; i++ {
		day := startDay.AddDate(0, 0, i)
		key := day.Format("2006-01-02")
		orderedDates = append(orderedDates, day)
		dailyMap[key] = &dailyBucket{students: make(map[string]struct{})}
	}

	type classAgg struct {
		dto      ClassUsageDTO
		students map[string]struct{}
		sessions map[string]struct{}
	}
	classMap := make(map[string]*classAgg, len(classes)+1)
	totalRegistered := 0
	for _, cl := range classes {
		key := cl.Name
		if key == "" {
			key = cl.ID
		}
		totalRegistered += cl.RegisteredStudents
		classMap[key] = &classAgg{
			dto: ClassUsageDTO{
				ClassID:            cl.ID,
				ClassName:          cl.Name,
				GradeLevel:         cl.GradeLevel,
				RegisteredStudents: cl.RegisteredStudents,
			},
			students: make(map[string]struct{}),
			sessions: make(map[string]struct{}),
		}
	}
	if totalRegistered == 0 {
		for _, p := range profiles {
			if !isNonStudentRole(p.Role) {
				totalRegistered++
			}
		}
	}

	type topicAgg struct {
		count       int
		terstruktur int
		students    map[string]struct{}
		classCounts map[string]int
		samples     []string
	}
	topicMap := make(map[string]*topicAgg)

	sessionSet := make(map[string]struct{})
	activeStudentSet := make(map[string]struct{})
	totalQuestions := 0
	periodQuestions := 0
	umumTotal := 0
	terstrukturTotal := 0

	for _, ex := range exchanges {
		uid := strings.TrimSpace(ex.UserID)
		prof, hasProf := profiles[uid]
		role := strings.TrimSpace(prof.Role)
		if role == "" {
			role = "siswa"
		}
		if scope == "students" && hasProf && isNonStudentRole(role) {
			continue
		}

		totalQuestions++
		if sid := strings.TrimSpace(ex.SessionID); sid != "" {
			sessionSet[sid] = struct{}{}
		}
		if uid != "" {
			activeStudentSet[uid] = struct{}{}
		}

		mode := strings.TrimSpace(ex.Mode)
		isDeep := mode == "terstruktur"
		if isDeep {
			terstrukturTotal++
		} else {
			umumTotal++
		}

		tsWIB := parseTimeOrNow(ex.CreatedAt, ex.Timestamp).In(analyticsWIB)
		dayKey := tsWIB.Format("2006-01-02")
		if bucket, ok := dailyMap[dayKey]; ok {
			periodQuestions++
			if isDeep {
				bucket.terstruktur++
			} else {
				bucket.umum++
			}
			if uid != "" {
				bucket.students[uid] = struct{}{}
			}
		}

		className := strings.TrimSpace(prof.ClassName)
		if className == "" {
			className = "Belum Terdaftar Kelas"
		}
		cAgg, ok := classMap[className]
		if !ok {
			cAgg = &classAgg{
				dto: ClassUsageDTO{
					ClassID:    strings.TrimSpace(prof.ClassID),
					ClassName:  className,
					GradeLevel: strings.TrimSpace(prof.GradeLevel),
				},
				students: make(map[string]struct{}),
				sessions: make(map[string]struct{}),
			}
			classMap[className] = cAgg
		}
		cAgg.dto.TotalQuestions++
		if isDeep {
			cAgg.dto.TerstrukturCount++
		} else {
			cAgg.dto.UmumCount++
		}
		if uid != "" {
			cAgg.students[uid] = struct{}{}
		}
		if sid := strings.TrimSpace(ex.SessionID); sid != "" {
			cAgg.sessions[sid] = struct{}{}
		}

		topic := classifyExchangeTopic(ex)
		tAgg, ok := topicMap[topic]
		if !ok {
			tAgg = &topicAgg{
				students:    make(map[string]struct{}),
				classCounts: make(map[string]int),
				samples:     make([]string, 0, 2),
			}
			topicMap[topic] = tAgg
		}
		tAgg.count++
		if isDeep {
			tAgg.terstruktur++
		}
		if uid != "" {
			tAgg.students[uid] = struct{}{}
		}
		tAgg.classCounts[className]++
		qTrim := strings.TrimSpace(ex.Question)
		if qTrim != "" && len(tAgg.samples) < 2 {
			tAgg.samples = append(tAgg.samples, truncateRunes(qTrim, 96))
		}
	}

	dailyUsage := make([]DailyUsagePointDTO, 0, len(orderedDates))
	for _, day := range orderedDates {
		key := day.Format("2006-01-02")
		b := dailyMap[key]
		dailyUsage = append(dailyUsage, DailyUsagePointDTO{
			Date:           key,
			Label:          formatDayLabelID(day),
			Umum:           b.umum,
			Terstruktur:    b.terstruktur,
			Total:          b.umum + b.terstruktur,
			ActiveStudents: len(b.students),
		})
	}

	classUsage := make([]ClassUsageDTO, 0, len(classMap))
	for _, agg := range classMap {
		agg.dto.ActiveStudents = len(agg.students)
		agg.dto.TotalConversations = len(agg.sessions)
		if totalQuestions > 0 {
			agg.dto.SharePercent = roundOneDecimal(float64(agg.dto.TotalQuestions) * 100 / float64(totalQuestions))
		}
		classUsage = append(classUsage, agg.dto)
	}
	sort.Slice(classUsage, func(i, j int) bool {
		if classUsage[i].TotalQuestions != classUsage[j].TotalQuestions {
			return classUsage[i].TotalQuestions > classUsage[j].TotalQuestions
		}
		if classUsage[i].RegisteredStudents != classUsage[j].RegisteredStudents {
			return classUsage[i].RegisteredStudents > classUsage[j].RegisteredStudents
		}
		return classUsage[i].ClassName < classUsage[j].ClassName
	})

	topTopics := make([]TopicSummaryDTO, 0, len(topicMap))
	for name, agg := range topicMap {
		type cc struct {
			name  string
			count int
		}
		ccs := make([]cc, 0, len(agg.classCounts))
		for clName, cnt := range agg.classCounts {
			ccs = append(ccs, cc{name: clName, count: cnt})
		}
		sort.Slice(ccs, func(i, j int) bool {
			if ccs[i].count != ccs[j].count {
				return ccs[i].count > ccs[j].count
			}
			return ccs[i].name < ccs[j].name
		})
		topClassTags := make([]string, 0, 2)
		for i := 0; i < len(ccs) && i < 2; i++ {
			topClassTags = append(topClassTags, ccs[i].name+" ("+strconv.Itoa(ccs[i].count)+")")
		}

		share := 0.0
		if totalQuestions > 0 {
			share = roundOneDecimal(float64(agg.count) * 100 / float64(totalQuestions))
		}
		topTopics = append(topTopics, TopicSummaryDTO{
			Topic:            name,
			QuestionCount:    agg.count,
			SharePercent:     share,
			StudentCount:     len(agg.students),
			TerstrukturCount: agg.terstruktur,
			TopClasses:       topClassTags,
			SampleQuestions:  agg.samples,
		})
	}
	sort.Slice(topTopics, func(i, j int) bool {
		if topTopics[i].QuestionCount != topTopics[j].QuestionCount {
			return topTopics[i].QuestionCount > topTopics[j].QuestionCount
		}
		return topTopics[i].Topic < topTopics[j].Topic
	})

	topClassName := "-"
	if len(classUsage) > 0 && classUsage[0].TotalQuestions > 0 {
		topClassName = classUsage[0].ClassName
	}
	topTopicName := "-"
	if len(topTopics) > 0 {
		topTopicName = topTopics[0].Topic
	}
	deepPercent := 0.0
	if totalQuestions > 0 {
		deepPercent = roundOneDecimal(float64(terstrukturTotal) * 100 / float64(totalQuestions))
	}

	return AdminAnalyticsDTO{
		GeneratedAt: now.UTC(),
		Days:        days,
		Scope:       scope,
		Summary: AnalyticsSummaryDTO{
			TotalQuestions:          totalQuestions,
			PeriodQuestions:         periodQuestions,
			TotalConversations:      len(sessionSet),
			ActiveStudents:          len(activeStudentSet),
			TotalRegisteredStudents: totalRegistered,
			UmumCount:               umumTotal,
			TerstrukturCount:        terstrukturTotal,
			DeepThinkPercent:        deepPercent,
			TopClassName:            topClassName,
			TopTopicName:            topTopicName,
		},
		DailyUsage: dailyUsage,
		ClassUsage: classUsage,
		TopTopics:  topTopics,
	}
}

func (h *AdminHandler) GetAnalytics(c *gin.Context) {
	days, _ := strconv.Atoi(c.Query("days"))
	if days != 7 && days != 30 {
		days = 14
	}
	scope := normalizeExportScope(c.Query("scope"))

	var docs []astraChatDoc
	if h.astra != nil && h.astra.IsConfigured() {
		if err := h.astra.FindAll(
			c.Request.Context(),
			map[string]any{"type": "exchange"},
			nil,
			&docs,
		); err != nil {
			response.InternalError(c, "Gagal memuat analitik penggunaan AI dari Astra DB.")
			return
		}
	}

	classes, profiles := h.loadAnalyticsMetadata(c.Request.Context())
	dto := buildChatAnalytics(docs, classes, profiles, days, scope, time.Now().UTC())
	c.JSON(http.StatusOK, dto)
}
