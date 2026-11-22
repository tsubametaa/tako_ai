import type { ThemeStorage } from '../../application/ports';
import {
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '../../domain/theme';
import { LocalStorageThemeStorage } from '../../infrastructure/localStorageThemeStorage';

export class ThemeController {
  private storage: ThemeStorage;
  private mediaQuery: MediaQueryList | null = null;
  private mediaListener: ((event: MediaQueryListEvent) => void) | null = null;

  preference = $state<ThemePreference>('system');
  systemPrefersDark = $state(false);

  resolved = $derived<ResolvedTheme>(
    resolveTheme(this.preference, this.systemPrefersDark),
  );

  constructor(storage: ThemeStorage = new LocalStorageThemeStorage()) {
    this.storage = storage;
  }

  init(): void {
    if (typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark = this.mediaQuery.matches;

    this.mediaListener = (event: MediaQueryListEvent) => {
      this.systemPrefersDark = event.matches;
      this.applyToDocument();
    };
    this.mediaQuery.addEventListener('change', this.mediaListener);

    const stored = this.storage.get();
    if (stored) {
      this.preference = stored;
    } else {
      this.preference = 'system';
    }

    this.applyToDocument();
  }

  setPreference(next: ThemePreference): void {
    this.preference = next;
    this.storage.set(next);
    this.applyToDocument();
  }

  cycleTheme(): void {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const currentIndex = order.indexOf(this.preference);
    const nextIndex = (currentIndex + 1) % order.length;
    this.setPreference(order[nextIndex]);
  }

  toggleDayDark(): void {
    const next: ThemePreference = this.resolved === 'dark' ? 'light' : 'dark';
    this.setPreference(next);
  }

  destroy(): void {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }

  private applyToDocument(): void {
    if (typeof document === 'undefined') return;
    const resolvedTheme = resolveTheme(this.preference, this.systemPrefersDark);
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }
}

export const themeController = new ThemeController();

