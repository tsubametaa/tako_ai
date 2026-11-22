import type { ThemeStorage } from '../application/ports';
import { THEME_STORAGE_KEY, type ThemePreference } from '../domain/theme';

export class LocalStorageThemeStorage implements ThemeStorage {
  get(): ThemePreference | null {
    if (typeof window === 'undefined') return null;
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      if (value === 'light' || value === 'dark' || value === 'system') {
        return value;
      }
      return null;
    } catch {
      return null;
    }
  }

  set(theme: ThemePreference): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore write errors in restricted storage environments
    }
  }

  remove(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }
}

