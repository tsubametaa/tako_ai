import type { ChatGateway, SendMessageOptions } from '../application/ports';
import type { Message } from '../domain/message';

export class MockChatGateway implements ChatGateway {
  private activeTimeouts: Map<string, ReturnType<typeof setTimeout>[]> = new Map();
  private messagesByRoom: Map<string, Message[]> = new Map();

  constructor() {
    this.messagesByRoom.set('demo-room-1', [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Apa perbedaan antara data latih dan data uji dalam machine learning?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content:
          'Dalam pembelajaran mesin (*machine learning*), pemisahan data sangat penting:\n\n' +
          '1. **Data Latih (*Training Data*)**: Data yang digunakan model untuk belajar mengenali pola dan memperbarui bobot parameter.\n' +
          '2. **Data Uji (*Testing Data*)**: Data baru yang belum pernah dilihat model saat pelatihan, digunakan untuk menguji kemampuan generalisasi.\n\n' +
          'Coba bayangkan seperti ujian sekolah: soal latihan di kelas adalah *data latih*, sedangkan soal saat ujian sesungguhnya adalah *data uji*. Sekarang, coba ceritakan mengapa kita tidak boleh menguji model dengan data latih?',
        timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
        sources: [
          {
            id: 'src-1',
            title: 'Buku Siswa KKA Kelas X - Konsep Dasar AI',
            section: 'Bab 3: Pembelajaran Mesin',
            page: 42,
            snippet: 'Data latih bertindak sebagai materi pengenalan pola, sementara data uji memastikan model tidak menghafal (overfitting).',
          },
        ],
      },
    ]);
  }

  async loadMessages(conversationId: string): Promise<Message[]> {
    return this.messagesByRoom.get(conversationId) || [];
  }

  async sendMessage(options: SendMessageOptions): Promise<void> {
    const { conversationId, content, attachments, onToken, onStatus, onSources } = options;

    let roomMsgs = this.messagesByRoom.get(conversationId) || [];
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content,
      attachments: attachments && attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date().toISOString(),
    };
    roomMsgs = [...roomMsgs, userMsg];
    this.messagesByRoom.set(conversationId, roomMsgs);

    onStatus('retrieving');
    await new Promise((r) => setTimeout(r, 600));

    onSources([
      {
        id: `src-${Date.now()}`,
        title: 'Modul Ajar Koding dan Kecerdasan Artifisial SMA',
        section: 'Unit 2: Pemecahan Masalah dan Penalaran Komputasional',
        page: 18,
        snippet: 'Pendekatan bertahap membantu siswa memahami konsep abstrak melalui contoh konkret sebelum formalisasi kode.',
      },
    ]);

    onStatus('generating');

    let sampleResponse = '';
    if (attachments && attachments.length > 0) {
      const fileNames = attachments.map((a) => `**${a.name}**`).join(', ');
      sampleResponse =
        `Saya telah menerima dan menganalisis berkas ${fileNames} yang kamu lampirkan!\n\n` +
        `Berikut intisari materi terkait **Koding & Kecerdasan Artifisial (KKA)**:\n\n` +
        `1. **Pemahaman Dokumen**: Materi dalam dokumen ini menguraikan konsep komputasional dan implementasi logika dasar.\n` +
        `2. **Poin Pembahasan**: ${content.trim() ? `Menjawab pertanyaanmu: *" ${content.trim()} "*` : 'Kita bisa membedah ringkasan isi, menelaah kode/flowchart di dalamnya, atau mendiskusikan istilah yang sulit dipahami.'}\n` +
        `3. **Tips Belajar**: Coba kaitkan isi dokumen ini dengan materi percabangan, perulangan, atau etika kecerdasan artifisial yang sudah dipelajari di kelas X.\n\n` +
        `Ada bagian atau nomor halaman tertentu dari dokumen ini yang ingin kita bahas lebih dalam?`;
    } else {
      sampleResponse =
        `Terima kasih atas pertanyaanmu! Mari kita pelajari bersama langkah demi langkah.\n\n` +
        `Terkait *" ${content.slice(0, 30)}... "*:\n\n` +
        `- **Poin Utama:** Pada mata pelajaran KKA kelas X, setiap masalah komputasi dipecah menjadi bagian-bagian lebih kecil (*dekomposisi*).\n` +
        `- **Langkah Selanjutnya:** Perhatikan pola yang berulang atau aturan logika yang mendasari proses tersebut.\n\n` +
        `Coba kamu jelaskan kembali: bagian mana dari penjelasan ini yang paling menarik atau masih membingungkan bagimu?`;
    }

    const tokens = sampleResponse.split(/(?<=\s+)/);
    const timers: ReturnType<typeof setTimeout>[] = [];
    this.activeTimeouts.set(conversationId, timers);

    let accumulated = '';
    return new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index >= tokens.length) {
          clearInterval(interval);
          onStatus('completed');
          const assistantMsg: Message = {
            id: `ast-${Date.now()}`,
            role: 'assistant',
            content: accumulated,
            timestamp: new Date().toISOString(),
          };
          this.messagesByRoom.set(conversationId, [...roomMsgs, assistantMsg]);
          this.activeTimeouts.delete(conversationId);
          resolve();
          return;
        }

        const token = tokens[index];
        accumulated += token;
        onToken(token);
        index++;
      }, 40);

      timers.push(interval as unknown as ReturnType<typeof setTimeout>);
    });
  }

  async stopGeneration(conversationId: string): Promise<void> {
    const timers = this.activeTimeouts.get(conversationId);
    if (timers) {
      timers.forEach((t) => clearInterval(t as unknown as number));
      this.activeTimeouts.delete(conversationId);
    }
  }
}

export const mockChatGateway = new MockChatGateway();

