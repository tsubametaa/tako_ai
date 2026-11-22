import { apiRequest } from '$lib/shared/api';

export interface UploadJobResponse {
  job_id?: string;
  doc_id?: string;
  status?: string;
}

export interface AutoLearnedDoc {
  doc_id?: string;
  id?: string;
  title?: string;
  source_title?: string;
  topic?: string;
  content?: string;
  excerpt?: string;
  created_at?: string;
}

export async function uploadGlobalDocument(
  file: File,
  sourceTitle: string,
  topic: string,
): Promise<UploadJobResponse> {
  const formData = new FormData();
  if (sourceTitle.trim()) {
    formData.append('source_title', sourceTitle.trim());
  }
  if (topic.trim()) {
    formData.append('topic', topic.trim());
  }
  formData.append('file', file, file.name);

  return await apiRequest<UploadJobResponse>('/admin/rag/documents', {
    method: 'POST',
    body: formData,
  });
}

export async function fetchAutoLearnedDocs(
  limit = 50,
): Promise<AutoLearnedDoc[]> {
  const res = await apiRequest<
    AutoLearnedDoc[] | { items?: AutoLearnedDoc[]; documents?: AutoLearnedDoc[] }
  >(`/admin/rag/auto-learned?limit=${limit}`);

  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.items)) return res.items;
  if (res && Array.isArray(res.documents)) return res.documents;
  return [];
}

export async function deleteAdminDocument(docId: string): Promise<void> {
  await apiRequest<{ deleted?: boolean }>(
    `/admin/rag/documents/${encodeURIComponent(docId)}`,
    {
      method: 'DELETE',
    },
  );
}
