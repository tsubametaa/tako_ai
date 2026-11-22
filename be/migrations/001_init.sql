-- ============================================================================
-- SKEMA SUPABASE (KHUSUS AUTH & MANAJEMEN KELAS SEKOLAH)
-- Catatan:
-- Data conversations (sessions), messages (exchanges), dan persona disimpan
-- sepenuhnya di DataStax Astra DB (koleksi `rag.chat_history`), BUKAN di Supabase.
-- ============================================================================

-- Pastikan tabel chat/persona tidak berada di Supabase:
DROP TABLE IF EXISTS public.generations CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.user_personas CASCADE;
