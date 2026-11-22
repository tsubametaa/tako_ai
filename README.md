# TAKO AI (`chatbot_kka`)

Platform chatbot pembelajaran interaktif untuk mata pelajaran **Koding dan Kecerdasan Artifisial (KKA)** jenjang SMA/SMK Kelas X, lengkap dengan **Ruang Diskusi Siswa** dan **Panel Admin & Guru**.

Dirancang dengan arsitektur terpisah tiga lapis (**SvelteKit Frontend → Golang Gin API Gateway → Python FastAPI AI Service `kka_lab`**) serta pemisahan basis data antara **Supabase PostgreSQL** (autentikasi sekolah, profil, kelas) dan **DataStax Astra DB** (riwayat percakapan, persona belajar, serta vektor materi RAG).

---

## Fitur Utama

### 1. Ruang Belajar Siswa (`/chat`)
- **Mode Umum & Deep Think (`terstruktur`)**: Tombol **Deep Think** di komposer pesan untuk bimbingan langkah demi langkah (scaffolding pedagogis) agar siswa memahami alur berpikir, bukan sekadar menerima jawaban akhir.
- **Real-Time Streaming & Status Berpikir**: Respons AI dikirim bertahap via *Server-Sent Events (SSE)* dengan indikator teks shimmer minimalis, penghitung waktu berpikir (*live timer*), dan ringkasan durasi (*Dipikirkan X dtk*).
- **Rujukan Materi Kurikulum (RAG)**: Menampilkan sumber modul beserta nomor halaman (`SourceChip` & `SourcePanel`) serta penekanan otomatis pada pertanyaan pemantik (*Socratic Callout*).
- **Personalisasi Persona AI**: Siswa dapat memilih gaya penjelasan (*Bertahap & Interaktif*, *Analogi Nyata*, *Ringkas & Padat*) dan menulis instruksi gaya bicara khusus dengan tombol eksplisit **Simpan Persona** (tanpa beban *auto-save* saat mengetik).
- **Unggah Dokumen Belajar**: Mendukung lampiran materi pribadi (`PDF`, `PPT`, `PPTX`, `DOC`, `DOCX`, `TXT`, `MD`) yang diproses secara asinkron lewat pipeline OCR + RAG.
- **Sapaan Dinamis & Tema Day/Dark**: Sapaan personal berbasis waktu dan nama depan siswa, riwayat percakapan per topik, serta tema **Neo-Brutalism** (Light & Dark Mode).

### 2. Panel Admin & Guru (`/admin`)
- **Ringkasan Analitik AI**:
  - KPI nyata (total pertanyaan, total sesi, siswa aktif vs terdaftar, rasio Deep Think, kelas teraktif, topik terpopuler).
  - Grafik batang interaktif tren penggunaan AI harian (`7 / 14 / 30 Hari`, *Mode Umum vs Deep Think*).
  - Klasifikasi & grafik perbandingan keaktifan antar kelas.
  - Ringkasan topik yang paling banyak ditanyakan siswa beserta contoh pertanyaan terbaru.
- **Kelola Akun Siswa**: CRUD akun siswa, filter kelas, pencarian nama/username/NIS, dan paginasi SQL.
- **Log Chat Siswa & Export JSON**: Peninjauan transkrip tanya-jawab siswa beserta sumber materi, penghapusan room/pesan, serta **Export JSON** seluruh riwayat chat siswa dalam satu berkas terstruktur.
- **Materi Global (RAG) & Audit Auto-Learn**: Unggah bahan ajar kurikulum global dan audit pengetahuan otomatis.

---

## Tech Stack

| Lapisan | Teknologi Utama |
| :--- | :--- |
| **Frontend (`fe/`)** | Svelte `^5.57.0` (Runes), SvelteKit `^3.1.1` (`@sveltejs/adapter-node`), Tailwind CSS `^4.3.5`, `@tailwindcss/typography`, TypeScript `~6.0.2`, Vite `^8.3.0`, `@lucide/svelte`, `marked`, `dompurify` |
| **Backend Gateway (`be/`)** | Go `1.26.10`, Gin `v1.12.0`, `pgx/v5`, `golang-jwt/jwt/v5`, `bcrypt`, `go-redis/v9` & `redis_rate/v10` (opsional), HTTP Client + Circuit Breaker |
| **AI Microservice (`kka_lab`)** | FastAPI `0.116.1`, Uvicorn `0.35.0`, `Qwen/Qwen3-4B-Instruct-2507` + LoRA PEFT `0.17.1` (`transformers 4.57.1`), `astrapy 2.0.1`, Baidu Unlimited-OCR via vLLM |
| **Database & Storage** | **Supabase PostgreSQL** (auth, profil, kelas, enrollment) • **DataStax Astra DB** (koleksi `rag.chat_history` & `rag.rag_chatbot` `$vectorize`) • **Redis** (opsional cache, rate limit, SSE replay) |

---

## Struktur Proyek

```text
chatbot_kka/
├── be/                         # Backend API Gateway (Golang / Gin — Port 5000)
│   ├── cmd/
│   │   ├── api/                # Entrypoint HTTP server (:5000)
│   │   └── seed/               # Seeder akun sekolah awal ke Supabase
│   ├── internal/
│   │   ├── core/               # Config, aiclient (+SSE & circuit breaker), astradb, database, middleware
│   │   └── features/           # auth, chat, conversations (admin, analytics, export), students, persona, memory, rag, health
│   ├── migrations/             # Skema cleanup tabel chat di Supabase
│   └── Dockerfile
├── fe/                         # Frontend Web App (Svelte 5 / SvelteKit — Port 1234)
│   ├── src/
│   │   ├── lib/features/       # home, auth, chat, conversations, sources, settings, admin, shell, theme
│   │   ├── lib/shared/         # UI primitives, styles (tokens, base, neobrutalism, markdown), API client, subdomains
│   │   └── routes/             # SvelteKit pages (/home, /login, /chat, /admin/*)
│   ├── scripts/                # Pemeriksa batas baris kode (check-max-lines.mjs)
│   ├── test/                   # Unit test domain & routing frontend (node --test)
│   └── vite.config.ts
├── ARCHITECTURE.md             # Dokumentasi arsitektur sistem & alur data
├── LICENSE.md                  # Lisensi proyek
└── README.md
```

---

## Pemetaan Port Layanan

| Layanan | Port Default | Peran |
| :--- | :--- | :--- |
| **Frontend (`fe/`)** | `1234` | Aplikasi Web SvelteKit / Vite Dev Server (`http://127.0.0.1:1234`) |
| **Backend Gateway (`be/`)** | `5000` | API Gateway Golang Gin (`http://127.0.0.1:5000/api/v1`) |
| **AI Service (`kka_lab`)** | `8000` | Microservice FastAPI LLM + RAG (`AI_BASE_URL=http://127.0.0.1:8000`) |

---

## Cara Menjalankan di Lokal & Produksi (VPS)

### Prasyarat
- **Go** `1.26+`
- **Node.js** `22+` / `24+` (atau Bun)
- Kredensial **Supabase PostgreSQL**, **DataStax Astra DB**, dan layanan AI **`kka_lab`** yang berjalan pada port `8000` (serta **Redis** opsional untuk cache/rate-limit).

### 1. Konfigurasi Backend (`be/`)
Salin templat environment dan sesuaikan kredensialnya:
```bash
cd be
cp .env.example .env
```
Variabel penting di `be/.env`:
- `PORT=5000`
- `FRONTEND_ORIGINS=https://ai.utaaa.io,https://chat.utaaa.io,https://admin.utaaa.io,https://auth.utaaa.io,http://localhost:1234,http://127.0.0.1:1234`
- `DATABASE_URL=...` (PostgreSQL Supabase)
- `ASTRA_DB_API_ENDPOINT`, `ASTRA_DB_APPLICATION_TOKEN`, `ASTRA_DB_KEYSPACE`, `ASTRA_DB_CHAT_COLLECTION`
- `AI_BASE_URL=http://127.0.0.1:8000`, `AI_INTERNAL_SECRET`, `RAG_ADMIN_SECRET`

Jalankan backend Go:
```bash
go run ./cmd/api
```

### 2. Konfigurasi & Jalankan Frontend (`fe/`)
Salin templat environment:
```bash
cd fe
cp .env.example .env
npm install
```
Isi `fe/.env` untuk pengembangan lokal:
```env
PORT=1234
PUBLIC_API_BASE_URL=http://127.0.0.1:5000/api/v1
INTERNAL_API_BASE_URL=http://127.0.0.1:5000
```
Jalankan mode pengembangan (port `1234` + proxy `/api` ke `:5000`):
```bash
npm run dev
```

Untuk **build & jalankan di VPS produksi**:
1. Atur `PUBLIC_API_BASE_URL` di `fe/.env` sesuai alamat publik API di balik reverse proxy (mis. `https://api.utaaa.io/api/v1` atau `/api/v1` jika satu domain).
2. Build dan jalankan server Node pada port `1234`:
```bash
npm run build
npm start
```
3. Arahkan Nginx / reverse proxy ke `127.0.0.1:1234` (Frontend) dan `127.0.0.1:5000` (Backend API, dengan *buffering off* untuk endpoint SSE streaming).

---

## Pengujian & Verifikasi

```bash
# Backend Go
cd be
go build ./...
go test ./...

# Frontend SvelteKit
cd fe
node scripts/check-max-lines.mjs
node --test test/*.test.ts
node ./node_modules/svelte-check/bin/svelte-check --tsconfig ./tsconfig.json
```

---

## Dokumentasi Lanjutan & Lisensi
- Penjelasan teknis arsitektur, alur streaming, serta skema database tersedia di [ARCHITECTURE.md](./ARCHITECTURE.md).
- Ketentuan penggunaan dan lisensi tersedia di [LICENSE.md](./LICENSE.md).
