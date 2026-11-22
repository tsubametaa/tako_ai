<script lang="ts">
  import { Laptop, Moon, Sun } from '@lucide/svelte';
  import { themeController } from '$lib/features/theme';
</script>

<div class="flex flex-col gap-5">
  <div class="flex flex-col gap-2">
    <span class="text-xs font-extrabold uppercase tracking-wider text-muted">
      Pilihan Mode Tampilan
    </span>
    <div class="grid grid-cols-3 gap-2.5">
      <button
        type="button"
        class="neo-control flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition {themeController.preference === 'light'
          ? 'border-2 border-line bg-mustard text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
          : 'border-2 border-line bg-surface text-ink hover:bg-surface-soft'}"
        onclick={() => themeController.setPreference('light')}
      >
        <Sun class="h-5 w-5" aria-hidden="true" />
        <span>Terang</span>
      </button>

      <button
        type="button"
        class="neo-control flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition {themeController.preference === 'dark'
          ? 'border-2 border-line bg-mustard text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
          : 'border-2 border-line bg-surface text-ink hover:bg-surface-soft'}"
        onclick={() => themeController.setPreference('dark')}
      >
        <Moon class="h-5 w-5" aria-hidden="true" />
        <span>Gelap</span>
      </button>

      <button
        type="button"
        class="neo-control flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition {themeController.preference === 'system'
          ? 'border-2 border-line bg-mustard text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
          : 'border-2 border-line bg-surface text-ink hover:bg-surface-soft'}"
        onclick={() => themeController.setPreference('system')}
      >
        <Laptop class="h-5 w-5" aria-hidden="true" />
        <span>Sistem</span>
      </button>
    </div>
  </div>

  <!-- Pratinjau Palet Warna Neo-Brutalism -->
  <div class="flex flex-col gap-2 rounded-xl border-2 border-line bg-surface-soft p-4 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
    <span class="text-xs font-bold text-ink">Komposisi Palet Warna Resmi</span>
    <div class="grid grid-cols-3 gap-2 mt-1">
      <div class="flex flex-col items-center rounded-lg border-2 border-line bg-[#789D8E] p-2.5 text-white shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]">
        <span class="text-xs font-extrabold">Hijau Sage</span>
        <span class="text-[10px] font-mono">#789D8E</span>
      </div>
      <div class="flex flex-col items-center rounded-lg border-2 border-line bg-[#FFFFFF] p-2.5 text-black shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]">
        <span class="text-xs font-extrabold">Putih</span>
        <span class="text-[10px] font-mono">#FFFFFF</span>
      </div>
      <div class="flex flex-col items-center rounded-lg border-2 border-line bg-[#E1AD01] p-2.5 text-black shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]">
        <span class="text-xs font-extrabold">Mustard</span>
        <span class="text-[10px] font-mono">#E1AD01</span>
      </div>
    </div>
    <p class="mt-2 text-[11px] text-muted leading-relaxed">
      Trio warna dirancang dengan kontras tinggi (> 8:1) untuk kenyamanan membaca materi pelajaran tanpa membuat mata cepat lelah.
    </p>
  </div>
</div>

