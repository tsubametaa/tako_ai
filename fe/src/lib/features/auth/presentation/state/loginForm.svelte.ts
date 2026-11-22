import type { AuthGateway } from '../../application/ports';
import {
  validatePassword,
  validateUsernameOrEmail,
  type User,
} from '../../domain/user';
import { apiAuthGateway } from '../../infrastructure/apiAuthGateway';
import { authSessionController } from './authSession.svelte';

export class LoginFormController {
  private gateway: AuthGateway;

  usernameOrEmail = $state('');
  password = $state('');
  showPassword = $state(false);
  submitting = $state(false);
  fieldErrors = $state<{ username?: string; password?: string }>({});
  errorMessage = $state<string | null>(null);

  constructor(gateway: AuthGateway = apiAuthGateway) {
    this.gateway = gateway;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  validate(): boolean {
    const usernameError = validateUsernameOrEmail(this.usernameOrEmail);
    const passwordError = validatePassword(this.password);

    this.fieldErrors = {
      username: usernameError ?? undefined,
      password: passwordError ?? undefined,
    };

    return !usernameError && !passwordError;
  }

  async submit(onSuccess: (user: User) => void): Promise<void> {
    this.errorMessage = null;
    if (!this.validate() || this.submitting) return;

    this.submitting = true;
    try {
      const user = await this.gateway.login(
        this.usernameOrEmail,
        this.password,
      );
      authSessionController.setUser(user);
      onSuccess(user);
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'Terjadi kesalahan saat masuk. Coba lagi.';
      }
    } finally {
      this.submitting = false;
    }
  }
}
