import {
  ApiError,
  apiRequest,
  clearAuthStorage,
  getApiBaseUrl,
  getStoredToken,
} from '$lib/shared/api';

export interface AdminConversationItem {
  id: string;
  title: string;
  aiSessionId: string;
  userId: string;
  studentName: string;
  username: string;
  identifier: string;
  role: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface AdminMessageSource {
  id: string;
  label?: string;
  title: string;
  pages?: number[];
  topic?: string;
  excerpt?: string;
  url?: string;
}

export interface AdminChatMessage {
  id: string;
  conversationId: string;
  clientRequestId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  status: string;
  generationId?: string;
  sources: AdminMessageSource[];
}

export interface AdminMessagesResponse {
  conversation: AdminConversationItem;
  items: AdminChatMessage[];
}

export async function fetchAdminChats(
  query = '',
  limit = 50,
): Promise<AdminConversationItem[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (query.trim()) {
    params.set('q', query.trim());
  }
  const res = await apiRequest<{ items: AdminConversationItem[] }>(
    `/admin/chats?${params.toString()}`,
  );
  return res.items || [];
}

export async function fetchAdminChatMessages(
  conversationId: string,
): Promise<AdminMessagesResponse> {
  return await apiRequest<AdminMessagesResponse>(
    `/admin/chats/${encodeURIComponent(conversationId)}/messages`,
  );
}

export async function deleteAdminChatConversation(
  conversationId: string,
): Promise<{ deleted: boolean; aiSessionSynced?: boolean }> {
  return await apiRequest<{ deleted: boolean; aiSessionSynced?: boolean }>(
    `/admin/chats/${encodeURIComponent(conversationId)}`,
    {
      method: 'DELETE',
    },
  );
}

export async function deleteAdminChatMessage(
  conversationId: string,
  messageId: string,
): Promise<void> {
  await apiRequest<{ deleted: boolean }>(
    `/admin/chats/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`,
    {
      method: 'DELETE',
    },
  );
}

function resolveDownloadFilename(
  headerValue: string | null,
  fallback: string,
): string {
  if (!headerValue) return fallback;
  const match = headerValue.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)"?/i);
  if (!match?.[1]) return fallback;
  try {
    return decodeURIComponent(match[1].trim());
  } catch {
    return match[1].trim();
  }
}

export async function exportAdminChatsJson(
  scope: 'students' | 'all' = 'students',
): Promise<{ filename: string; sizeBytes: number }> {
  const headers = new Headers({ Accept: 'application/json' });
  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(
    `${getApiBaseUrl()}/admin/chats/export?scope=${encodeURIComponent(scope)}`,
    { method: 'GET', headers },
  );

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthStorage();
    }
    let message = 'Gagal mengekspor riwayat chat ke JSON.';
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
      else if (body?.message) message = body.message;
    } catch {
      // ignore non-JSON error body
    }
    throw new ApiError(res.status, {
      code: `HTTP_${res.status}`,
      message,
    });
  }

  const blob = await res.blob();
  const today = new Date().toISOString().slice(0, 10);
  const filename = resolveDownloadFilename(
    res.headers.get('Content-Disposition'),
    `tako-ai-chat-history-${scope}-${today}.json`,
  );

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

  return { filename, sizeBytes: blob.size };
}
