export interface Source {
  id: string;
  title: string;
  section?: string;
  page?: number;
  snippet: string;
  url?: string;
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

