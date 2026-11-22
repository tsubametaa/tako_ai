import type { ThemePreference } from '../domain/theme';

export interface ThemeStorage {
  get(): ThemePreference | null;
  set(theme: ThemePreference): void;
  remove(): void;
}

