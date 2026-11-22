export type GenerationStatus =
  | 'loading'
  | 'empty'
  | 'idle'
  | 'submitting'
  | 'queued'
  | 'retrieving'
  | 'generating'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'reconnecting';

export const MAX_MESSAGE_CHARACTERS = 4000;

export const GENERATION_STATUS_LABELS: Record<GenerationStatus, string> = {
  loading: 'Memuat percakapan…',
  empty: 'Mulai percakapan baru',
  idle: 'Siap',
  submitting: 'Mengirim pesan…',
  queued: 'Pertanyaanmu sedang menunggu giliran.',
  retrieving: 'Sedang mencari materi yang relevan…',
  generating: 'Menulis respons…',
  completed: 'Respons selesai',
  cancelled: 'Respons dihentikan',
  failed: 'Respons gagal dimuat',
  reconnecting: 'Koneksi terputus. Sedang menyambungkan kembali…',
};

