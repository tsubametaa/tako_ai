import type { AuthGateway } from '../../application/ports';
import type { User } from '../../domain/user';
import { apiAuthGateway } from '../../infrastructure/apiAuthGateway';

export class AuthSessionController {
  private gateway: AuthGateway;

  user = $state<User | null>(null);
  loading = $state(true);

  isAuthenticated = $derived(this.user !== null);

  constructor(gateway: AuthGateway = apiAuthGateway) {
    this.gateway = gateway;
  }

  async init(): Promise<void> {
    this.loading = true;
    try {
      this.user = await this.gateway.getCurrentUser();
    } finally {
      this.loading = false;
    }
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  async logout(): Promise<void> {
    await this.gateway.logout();
    this.user = null;
  }
}

export const authSessionController = new AuthSessionController();
