function resolveApiBaseUrl(raw?: string): string {
  const trimmed = (raw || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '/api/v1';
  if (trimmed.endsWith('/api/v1')) return trimmed;
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
}

export function getApiBaseUrl(): string {
  const envVars = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const raw = envVars?.PUBLIC_API_BASE_URL || envVars?.VITE_API_BASE_URL;
  return resolveApiBaseUrl(raw);
}

const TOKEN_STORAGE_KEY = 'kka_access_token';
const USER_STORAGE_KEY = 'kka_auth_user';

export interface ApiErrorPayload {
  code: string;
  message: string;
  requestId?: string;
  retryable?: boolean;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly retryable: boolean;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || 'Permintaan ke server gagal diproses.');
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.code || 'UNKNOWN_ERROR';
    this.requestId = payload.requestId;
    this.retryable = Boolean(payload.retryable);
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function getStoredUserJson<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredUserJson<T>(user: T | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function clearAuthStorage(): void {
  setStoredToken(null);
  setStoredUserJson(null);
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    if (data && typeof data === 'object' && 'error' in data && data.error) {
      return new ApiError(response.status, data.error as ApiErrorPayload);
    }
    if (data && typeof data.message === 'string') {
      return new ApiError(response.status, {
        code: 'HTTP_ERROR',
        message: data.message,
      });
    }
  } catch {
    // Fallback when body is not JSON
  }

  return new ApiError(response.status, {
    code: `HTTP_${response.status}`,
    message:
      response.status === 401
        ? 'Sesi tidak valid atau sudah berakhir. Silakan masuk kembali.'
        : response.status === 503
          ? 'Layanan AI sedang sibuk atau belum dapat dihubungi.'
          : 'Gagal menghubungi server backend.',
    retryable: response.status >= 500 || response.status === 429,
  });
}

function buildAuthHeaders(extra?: HeadersInit, isJson = true): Headers {
  const headers = new Headers(extra);
  if (isJson && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const hasBody = init.body !== undefined && init.body !== null;
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: buildAuthHeaders(init.headers, hasBody && !isFormData),
  });

  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') {
      clearAuthStorage();
    }
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiStream(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<Response> {
  const headers = buildAuthHeaders(
    {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    true,
  );

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthStorage();
    }
    throw await parseErrorResponse(response);
  }

  return response;
}
