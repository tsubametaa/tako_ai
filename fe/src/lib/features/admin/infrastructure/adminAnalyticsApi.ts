import { apiRequest } from '$lib/shared/api';

export type AnalyticsWindowDays = 7 | 14 | 30;
export type AnalyticsScope = 'students' | 'all';

export interface AnalyticsSummary {
  totalQuestions: number;
  periodQuestions: number;
  totalConversations: number;
  activeStudents: number;
  totalRegisteredStudents: number;
  umumCount: number;
  terstrukturCount: number;
  deepThinkPercent: number;
  topClassName: string;
  topTopicName: string;
}

export interface DailyUsagePoint {
  date: string;
  label: string;
  umum: number;
  terstruktur: number;
  total: number;
  activeStudents: number;
}

export interface ClassUsageItem {
  classId: string;
  className: string;
  gradeLevel: string;
  registeredStudents: number;
  activeStudents: number;
  totalQuestions: number;
  totalConversations: number;
  umumCount: number;
  terstrukturCount: number;
  sharePercent: number;
}

export interface TopicSummaryItem {
  topic: string;
  questionCount: number;
  sharePercent: number;
  studentCount: number;
  terstrukturCount: number;
  topClasses: string[];
  sampleQuestions: string[];
}

export interface AdminAnalyticsResponse {
  generatedAt: string;
  days: number;
  scope: AnalyticsScope;
  summary: AnalyticsSummary;
  dailyUsage: DailyUsagePoint[];
  classUsage: ClassUsageItem[];
  topTopics: TopicSummaryItem[];
}

export async function fetchAdminAnalytics(
  days: AnalyticsWindowDays = 14,
  scope: AnalyticsScope = 'students',
): Promise<AdminAnalyticsResponse> {
  const params = new URLSearchParams({
    days: String(days),
    scope,
  });
  return await apiRequest<AdminAnalyticsResponse>(
    `/admin/chats/analytics?${params.toString()}`,
  );
}
