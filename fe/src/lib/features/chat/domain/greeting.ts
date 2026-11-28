export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeGreeting {
  period: GreetingPeriod;
  salutation: string;
  subtitle: string;
}

export interface StarterPrompt {
  topic: string;
  question: string;
}

const COMMON_NAME_PREFIXES = new Set([
  'muhammad',
  'muhamad',
  'mohammad',
  'mohamad',
  'mochammad',
  'mochamad',
  'moch',
  'moch.',
  'moh',
  'moh.',
  'm',
  'm.',
]);

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    topic: 'Machine Learning',
    question: 'Apa perbedaan data latih dan data uji?',
  },
  {
    topic: 'Berpikir Komputasional',
    question: 'Bagaimana menyusun langkah penyelesaian masalah?',
  },
  {
    topic: 'Literasi AI',
    question: 'Bagaimana menilai informasi dari AI?',
  },
  {
    topic: 'Perancangan Sistem',
    question: 'Bantu saya memahami perancangan sistem AI.',
  },
];

function toTitleWord(word: string): string {
  const cleaned = word.trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

export function extractDisplayName(fullName?: string | null): string {
  const trimmed = fullName?.trim();
  if (!trimmed) return 'Sobat KKA';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Sobat KKA';

  const firstLower = parts[0].toLowerCase();
  const chosen =
    parts.length > 1 && COMMON_NAME_PREFIXES.has(firstLower)
      ? parts[1]
      : parts[0];

  return toTitleWord(chosen) || 'Sobat KKA';
}

export function getTimeGreeting(date: Date = new Date()): TimeGreeting {
  const hour = date.getHours();

  if (hour >= 4 && hour < 11) {
    return {
      period: 'morning',
      salutation: 'Selamat pagi',
      subtitle:
        'Awali hari dengan ide segar. Konsep KKA mana yang mau kita bedah bareng NEKO AI?',
    };
  }

  if (hour >= 11 && hour < 15) {
    return {
      period: 'afternoon',
      salutation: 'Selamat siang',
      subtitle:
        'Tetap fokus di tengah hari. Tanyakan materi koding atau AI yang masih bikin penasaran.',
    };
  }

  if (hour >= 15 && hour < 18) {
    return {
      period: 'evening',
      salutation: 'Selamat sore',
      subtitle:
        'Waktu yang pas buat review pelajaran atau latihan logika algoritma langkah demi langkah.',
    };
  }

  return {
    period: 'night',
    salutation: 'Selamat malam',
    subtitle:
      'Belajar santai malam ini? Ceritakan pertanyaanmu, NEKO AI siap bantu pelan-pelan.',
  };
}
