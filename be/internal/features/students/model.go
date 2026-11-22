package students

type ClassOptionDTO struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	GradeLevel string `json:"gradeLevel"`
}

type StudentDTO struct {
	ID         string `json:"id"`
	FullName   string `json:"fullName"`
	Username   string `json:"username"`
	Identifier string `json:"identifier"`
	Role       string `json:"role"`
	ClassID    string `json:"classId"`
	ClassName  string `json:"className"`
	GradeLevel string `json:"gradeLevel"`
}

type PaginationDTO struct {
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totalPages"`
}

type ListStudentsResponse struct {
	Items      []StudentDTO     `json:"items"`
	Classes    []ClassOptionDTO `json:"classes"`
	Pagination PaginationDTO    `json:"pagination"`
}

type CreateStudentRequest struct {
	FullName   string `json:"fullName"`
	Username   string `json:"username"`
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
	ClassID    string `json:"classId"`
}

type UpdateStudentRequest struct {
	FullName   string `json:"fullName"`
	Username   string `json:"username"`
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
	ClassID    string `json:"classId"`
}
