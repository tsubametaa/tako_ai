import {
  fetchAdminAnalytics,
  type AdminAnalyticsResponse,
  type AnalyticsScope,
  type AnalyticsWindowDays,
} from '../../infrastructure/adminAnalyticsApi';

export class AdminAnalyticsController {
  days = $state<AnalyticsWindowDays>(14);
  scope = $state<AnalyticsScope>('students');
  loading = $state(false);
  errorMessage = $state<string | null>(null);
  data = $state<AdminAnalyticsResponse | null>(null);

  async load(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    try {
      this.data = await fetchAdminAnalytics(this.days, this.scope);
    } catch (err) {
      this.errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal memuat analitik penggunaan NEKO AI.';
    } finally {
      this.loading = false;
    }
  }

  setDays(nextDays: AnalyticsWindowDays): void {
    if (this.days === nextDays) return;
    this.days = nextDays;
    void this.load();
  }

  setScope(nextScope: AnalyticsScope): void {
    if (this.scope === nextScope) return;
    this.scope = nextScope;
    void this.load();
  }
}
