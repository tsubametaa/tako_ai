import {
  ApiError,
  apiRequest,
  clearAuthStorage,
  getStoredToken,
  getStoredUserJson,
  setStoredToken,
  setStoredUserJson,
} from '$lib/shared/api';
import type { AuthGateway } from '../application/ports';
import type { User } from '../domain/user';

interface BackendUserDto {
  id: string;
  displayName: string;
  username: string;
  role: 'siswa' | 'guru' | 'student' | 'teacher' | 'admin' | string;
  identifier?: string;
  className?: string;
  gradeLevel?: string;
}

interface LoginResponseDto {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: BackendUserDto;
}

function mapBackendUser(dto: BackendUserDto): User {
  const normalizedRole = String(dto.role || '').trim().toLowerCase();
  const isTeacher =
    normalizedRole === 'guru' ||
    normalizedRole === 'teacher' ||
    normalizedRole === 'admin';
  return {
    id: dto.id,
    name: dto.displayName || dto.username,
    email: dto.username,
    username: dto.username,
    identifier: dto.identifier,
    className: dto.className,
    gradeLevel: dto.gradeLevel,
    role: isTeacher ? 'teacher' : 'student',
  };
}

export class ApiAuthGateway implements AuthGateway {
  async login(usernameOrEmail: string, password: string): Promise<User> {
    const res = await apiRequest<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: usernameOrEmail.trim(),
        password,
      }),
    });

    const user = mapBackendUser(res.user);
    setStoredToken(res.accessToken);
    setStoredUserJson(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      if (getStoredToken()) {
        await apiRequest<{ loggedOut: boolean }>('/auth/logout', {
          method: 'POST',
        });
      }
    } catch {
      // Ignore network/401 errors on logout
    } finally {
      clearAuthStorage();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const res = await apiRequest<{ user: BackendUserDto }>('/auth/me');
      const user = mapBackendUser(res.user);
      setStoredUserJson(user);
      return user;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuthStorage();
        return null;
      }
      return getStoredUserJson<User>();
    }
  }
}

export const apiAuthGateway = new ApiAuthGateway();
