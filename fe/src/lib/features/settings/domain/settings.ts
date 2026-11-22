export type SettingsTab = 'account' | 'personalization' | 'theme' | 'help' | 'settings';

export type AiExplanationStyle = 'structured' | 'analogy' | 'concise' | 'custom';
export type AiTone = 'friendly' | 'formal';

export interface AiPersonalizationConfig {
  style: AiExplanationStyle;
  tone: AiTone;
  includeCode: boolean;
  customInstructions: string;
}

export interface TabConfig {
  id: SettingsTab;
  label: string;
  description: string;
}

export const SETTINGS_TABS: TabConfig[] = [
  {
    id: 'account',
    label: 'Akun',
    description: 'Informasi profil siswa dan identitas kelas',
  },
  {
    id: 'personalization',
    label: 'Personalisasi AI',
    description: 'Sesuaikan gaya dan kedalaman penjelasan jawaban asisten',
  },
  {
    id: 'theme',
    label: 'Tema',
    description: 'Pilihan mode tampilan dan palet warna visual',
  },
  {
    id: 'help',
    label: 'Bantuan',
    description: 'Panduan belajar KKA dan pertanyaan umum',
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    description: 'Preferensi sistem dan informasi aplikasi',
  },
];
