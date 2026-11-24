export interface Source {
  id: string;
  title: string;
  topic?: string;
  section?: string;
  page?: number;
  snippet: string;
  url?: string;
}

const GENERIC_SOURCE_LABEL_RE = /^(?:S\d+|Sumber\s+\d+)$/i;

export function resolveSourceTopic(src: Pick<Source, 'topic' | 'section'>): string {
  const raw = (src.topic || src.section || '').replace(/\s+/g, ' ').trim();
  if (!raw || GENERIC_SOURCE_LABEL_RE.test(raw)) return '';
  return raw;
}

export function isSafeUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function extractContextTopics(
  sources?: Source[],
  maxTopics = 3,
): string[] {
  if (!sources || sources.length === 0 || maxTopics <= 0) return [];
  const topics: string[] = [];
  const seen = new Set<string>();

  for (const src of sources) {
    const raw = resolveSourceTopic(src);
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    topics.push(raw);
    if (topics.length >= maxTopics) break;
  }

  return topics;
}
