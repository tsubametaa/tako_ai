import type { AuthGateway } from '../application/ports';
import type { User } from '../domain/user';

const AUTH_STORAGE_KEY = 'kka_auth_user';

export class MockAuthGateway implements AuthGateway {
  async login(usernameOrEmail: string, password: string): Promise<User> {
    // Simulate brief network delay
    await new Promise((r) => setTimeout(r, 450));

    const trimmed = usernameOrEmail.trim().toLowerCase();

    // Check credential simulation
    if (password === 'salah' || password === 'error') {
      throw new Error('Akun atau kata sandi tidak sesuai.');
    }
    if (password === 'offline') {
      throw new Error('Belum dapat terhubung. Periksa koneksi lalu coba lagi.');
    }

    const mockUser: User = {
      id: 'student-x-1',
      name: trimmed.includes('@') ? trimmed.split('@')[0] : usernameOrEmail,
      email: trimmed.includes('@') ? trimmed : `${trimmed}@kka.sch.id`,
      role: 'student',
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      } catch {
        // Ignore storage errors
      }
    }

    return mockUser;
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
}

export const mockAuthGateway = new MockAuthGateway();

