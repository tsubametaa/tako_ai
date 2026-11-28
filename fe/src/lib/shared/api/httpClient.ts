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

function resolveSharedCookieDomain(hostname: string): string | null {
  const host = hostname.trim().toLowerCase();
  if (host === 'utaaa.io' || host.endsWith('.utaaa.io')) return '.utaaa.io';
  if (host === 'neko.ai.id' || host.endsWith('.neko.ai.id')) return '.neko.ai.id';
  return null;
}

function readTokenCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${TOKEN_STORAGE_KEY}=`;
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      const value = trimmed.slice(prefix.length);
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

function writeTokenCookie(token: string | null): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const domain = resolveSharedCookieDomain(window.location.hostname);
  if (!domain) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  if (token) {
    document.cookie = `${TOKEN_STORAGE_KEY}=${encodeURIComponent(token)}; Domain=${domain}; Path=/; SameSite=Lax; Max-Age=86400${secure}`;
  } else {
    document.cookie = `${TOKEN_STORAGE_KEY}=; Domain=${domain}; Path=/; SameSite=Lax; Max-Age=0${secure}`;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (localToken) return localToken;
    const cookieToken = readTokenCookie();
    if (cookieToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, cookieToken);
    }
    return cookieToken;
  } catch {
    return readTokenCookie();
  }
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  writeTokenCookie(token);
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
