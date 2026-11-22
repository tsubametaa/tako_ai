import { apiRequest } from '$lib/shared/api';

export interface AdminClassOption {
  id: string;
  name: string;
  gradeLevel: string;
}

export interface AdminStudentItem {
  id: string;
  fullName: string;
  username: string;
  identifier: string;
  role: string;
  classId: string;
  className: string;
  gradeLevel: string;
}

export interface AdminPaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ListAdminStudentsResponse {
  items: AdminStudentItem[];
  classes: AdminClassOption[];
  pagination: AdminPaginationMeta;
}

export interface CreateStudentPayload {
  fullName: string;
  username: string;
  identifier: string;
  password: string;
  classId: string;
}

export interface UpdateStudentPayload {
  fullName: string;
  username: string;
  identifier: string;
  password: string;
  classId: string;
}

export async function listAdminStudents(
  query = '',
  classId = '',
  page = 1,
  pageSize = 15,
): Promise<ListAdminStudentsResponse> {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (classId.trim()) params.set('class_id', classId.trim());
  params.set('page', String(Math.max(1, page)));
  params.set('page_size', String(pageSize));
  return apiRequest<ListAdminStudentsResponse>(
    `/admin/students?${params.toString()}`,
  );
}

export async function createAdminStudent(
  payload: CreateStudentPayload,
): Promise<AdminStudentItem> {
  const res = await apiRequest<{ student: AdminStudentItem }>('/admin/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.student;
}

export async function updateAdminStudent(
  id: string,
  payload: UpdateStudentPayload,
): Promise<AdminStudentItem> {
  const res = await apiRequest<{ student: AdminStudentItem }>(
    `/admin/students/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
  return res.student;
}

export async function deleteAdminStudent(id: string): Promise<void> {
  await apiRequest<{ deleted: boolean; id: string }>(
    `/admin/students/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  );
}
