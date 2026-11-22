<script lang="ts">
  import { User } from '@lucide/svelte';

  interface Props {
    displayName?: string;
    username?: string;
    className?: string;
    gradeLevel?: string;
    role?: 'student' | 'teacher';
  }

  let {
    displayName = 'Siswa Kelas X',
    username = 'siswa.x01',
    className = '',
    gradeLevel = '',
    role = 'student',
  }: Props = $props();

  const classLabel = $derived(
    className.trim()
      ? className.trim()
      : gradeLevel.trim()
        ? `Kelas ${gradeLevel.trim()}`
        : role === 'teacher'
          ? 'Pengampu KKA'
          : 'Belum terdaftar di kelas',
  );
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center gap-3.5 rounded-2xl border-2 border-line bg-surface-soft p-4 shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]">
    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/30 text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)]">
      <User class="h-6 w-6" aria-hidden="true" />
    </div>
    <div class="flex flex-col">
      <span class="text-sm font-extrabold text-ink">{displayName}</span>
      <span class="text-xs text-muted">@{username} • {classLabel}</span>
      <span class="mt-1 neo-badge self-start bg-mustard px-2 py-0.5 text-[10px] text-on-mustard">
        {role === 'teacher' ? 'Akun Guru Pengampu' : 'Akun Siswa Terautentikasi'}
      </span>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
    <div class="flex flex-col gap-1 rounded-xl border-2 border-line bg-surface p-3 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
      <span class="text-[11px] font-bold text-muted uppercase tracking-wider">Mata Pelajaran</span>
      <span class="font-bold text-ink">Koding & Kecerdasan Artifisial</span>
    </div>
    <div class="flex flex-col gap-1 rounded-xl border-2 border-line bg-surface p-3 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
      <span class="text-[11px] font-bold text-muted uppercase tracking-wider">Kelas</span>
      <span class="font-bold text-ink">{classLabel}</span>
    </div>
  </div>
</div>
