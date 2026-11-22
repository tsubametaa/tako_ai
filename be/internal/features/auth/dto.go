package auth

import "time"

type LoginRequest struct {
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
}

type UserDTO struct {
	ID          string `json:"id"`
	DisplayName string `json:"displayName"`
	Username    string `json:"username"`
	Role        string `json:"role"`
	Identifier  string `json:"identifier,omitempty"`
	ClassName   string `json:"className,omitempty"`
	GradeLevel  string `json:"gradeLevel,omitempty"`
}

type LoginResponse struct {
	AccessToken string    `json:"accessToken"`
	TokenType   string    `json:"tokenType"`
	ExpiresAt   time.Time `json:"expiresAt"`
	User        UserDTO   `json:"user"`
}

type AccountRecord struct {
	ID           string
	FullName     string
	Role         string
	Identifier   string
	Username     string
	PasswordHash string
	ClassName    string
	GradeLevel   string
}
