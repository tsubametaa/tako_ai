<script lang="ts">
  import { onMount } from 'svelte';
  import { Bot, Check, LoaderCircle, RotateCcw, Save } from '@lucide/svelte';
  import { Button } from '$lib/shared/ui';
  import { PersonalizationController } from '../state/personalization.svelte';

  const ctrl = new PersonalizationController();

  const quickTemplates = [
    {
      label: 'Analogi game & anime',
      text: 'Gunakan perumpamaan game atau anime saat menjelaskan konsep',
    },
    {
      label: 'Kuis di akhir jawaban',
      text: 'Beri saya 1 pertanyaan kuis singkat di akhir jawaban untuk latihan',
    },
    {
      label: 'Bahasa santai & santun',
      text: 'Jelaskan dengan bahasa santai dan ramah seperti teman belajar',
    },
    {
      label: 'Fokus alur logika',
      text: 'Fokus jelaskan alur logika dan algoritma sebelum menulis kode',
    },
  ];

  onMount(() => {
    void ctrl.init();
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    void ctrl.save();
  }
</script>

<form class="flex flex-col gap-3" onsubmit={handleSubmit}>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-center justify-between">
      <h3 class="text-[11px] font-extrabold uppercase tracking-wider text-muted">
        Gaya Penjelasan TAKO AI
      </h3>
      <span class="hidden text-[10px] text-muted sm:inline">
        Pilih preferensi uraian konsep koding & AI
      </span>
    </div>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button
        type="button"
        disabled={ctrl.saving}
        class="neo-control flex flex-col justify-between gap-1 rounded-xl p-2.5 text-left transition {ctrl.explanationStyle ===
        'structured'
          ? 'border-2 border-line bg-mustard/15 shadow-[2px_2px_0px_var(--neo-shadow-color)]'
          : 'border-2 border-line bg-surface hover:bg-surface-soft'}"
        onclick={() => ctrl.selectStyle('structured')}
      >
        <div class="flex w-full items-start justify-between gap-1">
          <span class="text-xs leading-tight font-extrabold text-ink">Bertahap & Interaktif</span>
          {#if ctrl.explanationStyle === 'structured'}
            <span class="neo-badge shrink-0 bg-mustard px-1.5 py-0.2 text-[8.5px] text-on-mustard">Aktif</span>
          {/if}
        </div>
        <p class="text-[10.5px] leading-snug text-muted">
          Membimbing langkah demi langkah dengan pertanyaan pemantik sebelum kesimpulan.
        </p>
      </button>

      <button
        type="button"
        disabled={ctrl.saving}
        class="neo-control flex flex-col justify-between gap-1 rounded-xl p-2.5 text-left transition {ctrl.explanationStyle ===
        'analogy'
          ? 'border-2 border-line bg-mustard/15 shadow-[2px_2px_0px_var(--neo-shadow-color)]'
          : 'border-2 border-line bg-surface hover:bg-surface-soft'}"
        onclick={() => ctrl.selectStyle('analogy')}
      >
        <div class="flex w-full items-start justify-between gap-1">
          <span class="text-xs leading-tight font-extrabold text-ink">Analogi Nyata</span>
          {#if ctrl.explanationStyle === 'analogy'}
            <span class="neo-badge shrink-0 bg-mustard px-1.5 py-0.2 text-[8.5px] text-on-mustard">Aktif</span>
          {/if}
        </div>
        <p class="text-[10.5px] leading-snug text-muted">
          Menguraikan konsep pemrograman memakai perumpamaan sehari-hari yang mudah diingat.
        </p>
      </button>

      <button
        type="button"
        disabled={ctrl.saving}
        class="neo-control flex flex-col justify-between gap-1 rounded-xl p-2.5 text-left transition {ctrl.explanationStyle ===
        'concise'
          ? 'border-2 border-line bg-mustard/15 shadow-[2px_2px_0px_var(--neo-shadow-color)]'
          : 'border-2 border-line bg-surface hover:bg-surface-soft'}"
        onclick={() => ctrl.selectStyle('concise')}
      >
        <div class="flex w-full items-start justify-between gap-1">
          <span class="text-xs leading-tight font-extrabold text-ink">Ringkas & Padat</span>
          {#if ctrl.explanationStyle === 'concise'}
            <span class="neo-badge shrink-0 bg-mustard px-1.5 py-0.2 text-[8.5px] text-on-mustard">Aktif</span>
          {/if}
        </div>
        <p class="text-[10.5px] leading-snug text-muted">
          Langsung menyajikan poin inti materi, pseudocode, atau formula tanpa pengantar.
        </p>
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-2.5 rounded-xl border-2 border-line bg-surface p-3 shadow-[2px_2px_0px_var(--neo-shadow-color)] md:p-3.5">
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-line bg-mustard text-on-mustard shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]">
          <Bot class="h-3.5 w-3.5" aria-hidden="true" />
        </div>
        <div>
          <h4 class="text-xs font-extrabold text-ink">Instruksi Khusus dari Kamu</h4>
          <p class="text-[10.5px] text-muted">
            Tulis gaya bahasa atau karakter yang kamu suka, lalu tekan Simpan Persona.
          </p>
        </div>
      </div>

      {#if ctrl.savedIndicator}
        <span class="neo-badge inline-flex items-center gap-1 bg-mustard px-2 py-0.5 text-[10px] text-on-mustard animate-in fade-in">
          <Check class="h-3 w-3" aria-hidden="true" />
          <span>Tersimpan</span>
        </span>
      {:else if ctrl.isDirty}
        <span class="rounded-md border border-line/30 bg-mustard-soft px-2 py-0.5 text-[10px] font-bold text-ink">
          Belum disimpan
        </span>
      {/if}
    </div>

    {#if ctrl.syncError}
      <p
        role="alert"
        class="rounded-lg border-2 border-danger bg-danger/10 px-3 py-2 text-[11px] font-bold text-danger"
      >
        {ctrl.syncError}
      </p>
    {/if}

    <div class="relative">
      <textarea
        rows={3}
        maxlength={350}
        disabled={ctrl.loading || ctrl.saving}
        value={ctrl.customInstructions}
        oninput={(e) => ctrl.onInstructionsInput(e.currentTarget.value)}
        placeholder="Contoh: Jelaskan dengan gaya santai seperti teman sebaya, pakai analogi game, dan tutup dengan 1 pertanyaan latihan singkat..."
        class="w-full min-h-[76px] resize-none rounded-xl border-2 border-line bg-surface-soft p-2.5 pb-6 text-xs leading-relaxed font-medium text-ink outline-none transition placeholder:text-muted/60 focus:border-neo-border focus:bg-surface focus:shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)] disabled:opacity-60"
      ></textarea>

      <div class="pointer-events-none absolute bottom-1.5 right-2.5 text-[9.5px] font-bold text-muted">
        {ctrl.customInstructions.length}/350
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-[10.5px] font-bold text-muted">
        Saran cepat (klik untuk menambahkan):
      </span>

      <div class="flex flex-wrap gap-1.5">
        {#each quickTemplates as tpl}
          <button
            type="button"
            disabled={ctrl.saving}
            class="neo-control inline-flex items-center gap-1 rounded-lg border-2 border-line bg-surface-soft px-2 py-0.5 text-[10px] font-bold text-ink transition hover:border-line hover:bg-mustard hover:text-on-mustard active:translate-y-px disabled:opacity-50"
            onclick={() => ctrl.applyTemplate(tpl.text)}
          >
            <span class="font-extrabold text-mustard">+</span>
            <span>{tpl.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-line/15 pt-2.5">
      <button
        type="button"
        disabled={ctrl.saving || (!ctrl.savedInstructions.trim() && !ctrl.customInstructions.trim())}
        class="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-muted transition hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
        onclick={() => ctrl.clearInstructions()}
      >
        <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reset Default</span>
      </button>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={ctrl.loading || ctrl.saving || !ctrl.isDirty}
      >
        {#if ctrl.saving}
          <LoaderCircle class="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          <span>Menyimpan…</span>
        {:else}
          <Save class="h-3.5 w-3.5" aria-hidden="true" />
          <span>Simpan Persona</span>
        {/if}
      </Button>
    </div>
  </div>
</form>
