export interface AboutDialogueExample {
  id: string;
  tabLabel: string;
  question: string;
  reply: string;
  promptBack: string;
  sourceLabel: string;
}

export interface AboutCapability {
  id: 'sources' | 'personalization' | 'history';
  title: string;
  description: string;
}

export const FOOTER_COPYRIGHT = 'Copyright 2026 - By Utaaa';

export const ABOUT_DIALOGUES: AboutDialogueExample[] = [
  {
    id: 'data-latih-uji',
    tabLabel: 'Data Latih & Uji',
    question: 'Apa perbedaan data latih dan data uji dalam machine learning?',
    reply:
      'Bayangkan kamu lagi siapin diri buat ulangan. Data latih itu seperti kumpulan soal latihan yang kamu kerjakan untuk belajar pola, sedangkan data uji itu soal ujian beneran yang belum pernah kamu lihat sebelumnya.',
    promptBack:
      'Menurutmu, apa akibatnya kalau soal ujiannya sama persis dengan soal latihan?',
    sourceLabel: 'Modul KKA Kelas X: Pemodelan & Evaluasi Data',
  },
  {
    id: 'susun-algoritma',
    tabLabel: 'Logika Algoritma',
    question: 'Gimana cara mulai menyusun langkah penyelesaian masalah buat coding?',
    reply:
      'Mulai dengan memecah masalah besar jadi bagian kecil (dekomposisi), lalu cari pola yang berulang sebelum menulis baris kode. Dengan begitu, alur logikanya kebayang dulu sebelum pilih bahasa pemrograman.',
    promptBack:
      'Coba sebutkan 3 langkah awal kalau kamu mau bikin program pengecek nilai ujian!',
    sourceLabel: 'Modul KKA Kelas X: Berpikir Komputasional',
  },
  {
    id: 'cek-info-ai',
    tabLabel: 'Cek Info AI',
    question: 'Kenapa jawaban AI tidak boleh langsung dipercaya 100%?',
    reply:
      'Model bahasa generatif menyusun kata berdasarkan pola statistik, sehingga tetap bisa keliru menyebut fakta atau mengarang referensi. Biasakan verifikasi ke sumber utama atau modul belajar.',
    promptBack:
      'Bagian mana dari jawaban AI yang paling penting kamu cek ulang sebelum dipakai di tugas?',
    sourceLabel: 'Modul KKA Kelas X: Literasi & Etika AI',
  },
];

export const ABOUT_CAPABILITIES: AboutCapability[] = [
  {
    id: 'sources',
    title: 'Rujukan Materi Kurikulum Jelas',
    description:
      'Penjelasan NEKO mengacu pada bahan ajar KKA yang dikelola guru, lengkap dengan panel sumber untuk meninjau topik dan kutipannya.',
  },
  {
    id: 'personalization',
    title: 'Gaya Belajar Bisa Disesuaikan',
    description:
      'Atur gaya jawaban sesuai seleramu: terstruktur, pakai analogi sehari-hari, atau ringkas, dengan atau tanpa contoh kode.',
  },
  {
    id: 'history',
    title: 'Riwayat Diskusi Rapi per Topik',
    description:
      'Simpan percakapan berdasarkan bab pelajaran, ubah judul room, dan cari ulang catatan belajarmu kapan saja.',
  },
];
