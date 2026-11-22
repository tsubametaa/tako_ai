export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  lastActivityAt: string;
}

export const MAX_INITIAL_TITLE_LENGTH = 60;
export const MAX_EDITED_TITLE_LENGTH = 100;

export type DateGroupLabel =
  | 'Hari ini'
  | 'Kemarin'
  | '7 hari terakhir'
  | '30 hari terakhir'
  | 'Lebih lama';

export interface ConversationGroup {
  label: DateGroupLabel;
  conversations: Conversation[];
}

function getJakartaDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

export function groupConversationsByDate(
  conversations: Conversation[],
  now = new Date(),
): ConversationGroup[] {
  const todayKey = getJakartaDateKey(now);
  const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayKey = getJakartaDateKey(yesterdayDate);

  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  const groups: Record<DateGroupLabel, Conversation[]> = {
    'Hari ini': [],
    'Kemarin': [],
    '7 hari terakhir': [],
    '30 hari terakhir': [],
    'Lebih lama': [],
  };

  const sorted = [...conversations].sort(
    (a, b) =>
      new Date(b.lastActivityAt).getTime() -
      new Date(a.lastActivityAt).getTime(),
  );

  for (const conv of sorted) {
    const convDate = new Date(conv.lastActivityAt);
    const convKey = getJakartaDateKey(convDate);
    const convTime = convDate.getTime();

    if (convKey === todayKey) {
      groups['Hari ini'].push(conv);
    } else if (convKey === yesterdayKey) {
      groups['Kemarin'].push(conv);
    } else if (convTime >= sevenDaysAgo) {
      groups['7 hari terakhir'].push(conv);
    } else if (convTime >= thirtyDaysAgo) {
      groups['30 hari terakhir'].push(conv);
    } else {
      groups['Lebih lama'].push(conv);
    }
  }

  const result: ConversationGroup[] = [];
  const order: DateGroupLabel[] = [
    'Hari ini',
    'Kemarin',
    '7 hari terakhir',
    '30 hari terakhir',
    'Lebih lama',
  ];

  for (const label of order) {
    if (groups[label].length > 0) {
      result.push({ label, conversations: groups[label] });
    }
  }

  return result;
}

