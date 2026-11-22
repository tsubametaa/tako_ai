import type { User } from '../domain/user';

export interface AuthGateway {
  login(usernameOrEmail: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

