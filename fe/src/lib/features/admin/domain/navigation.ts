export type AdminSectionId =
  | 'overview'
  | 'students'
  | 'chats'
  | 'materi'
  | 'audit';

export interface AdminSection {
  id: AdminSectionId;
  subPath: string;
  label: string;
  title: string;
  description: string;
  backendEndpoint?: string;
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: 'overview',
    subPath: '/',
    label: 'Ringkasan',
    title: 'Panel Admin & Guru',
    description:
      'Pusat kendali pengelolaan akun siswa, pemantauan log percakapan, materi kurikulum global, dan audit pengetahuan otomatis.',
  },
  {
    id: 'students',
    subPath: '/students',
    label: 'Akun Siswa',
    title: 'Kelola Akun Siswa',
    description:
      'Tambah akun siswa baru, perbarui nama/username/NIS dan kelas, reset kata sandi, atau hapus akun siswa.',
    backendEndpoint: 'GET / POST / PUT / DELETE /api/v1/admin/students',
  },
  {
    id: 'chats',
    subPath: '/chats',
    label: 'Log Chat Siswa',
    title: 'Log Percakapan Siswa & AI',
    description:
      'Pantau seluruh riwayat tanya-jawab siswa dengan NEKO AI, periksa sumber RAG, dan hapus percakapan atau pesan tertentu.',
    backendEndpoint: 'GET / DELETE /api/v1/admin/chats',
  },
  {
    id: 'materi',
    subPath: '/materi',
    label: 'Materi Global',
    title: 'Dokumen Materi Global (RAG)',
    description:
      'Unggah dan kelola dokumen acuan kurikulum yang dapat diakses seluruh siswa saat berdiskusi.',
    backendEndpoint: 'POST / DELETE /api/v1/admin/rag/documents',
  },
  {
    id: 'audit',
    subPath: '/audit',
    label: 'Audit Auto-Learn',
    title: 'Audit Materi Auto-Learned',
    description:
      'Tinjau dan bersihkan entri pengetahuan otomatis yang tersimpan dari interaksi pembelajaran.',
    backendEndpoint: 'GET /api/v1/admin/rag/auto-learned',
  },
];
