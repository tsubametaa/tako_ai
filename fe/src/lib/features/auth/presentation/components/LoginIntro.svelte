<script lang="ts">
  import { BookOpen, CheckCircle2, MessageSquare } from '@lucide/svelte';
  import { Card, NekoMark } from '$lib/shared/ui';
</script>

<div class="hidden flex-col justify-between p-8 lg:flex lg:w-1/2">
  <div class="flex items-center gap-2.5">
    <NekoMark size="lg" />
    <span class="text-base font-extrabold text-ink">
      NEKO <span class="text-primary">AI</span>
    </span>
  </div>

  <div class="my-auto flex flex-col gap-6 max-w-md">
    <div>
      <h2 class="text-3xl font-extrabold tracking-tight text-ink">
        Belajar Koding dan AI Lebih Menyenangkan
      </h2>
      <p class="mt-3 text-sm leading-relaxed text-muted font-medium">
        Ruang diskusi interaktif untuk siswa kelas X. Dapatkan panduan bertahap, telaah contoh nyata, dan pahami materi kurikulum KKA dengan bantuan asisten cerdas.
      </p>
    </div>

    <!-- Neo-Brutalist Feature Cards -->
    <div class="grid grid-cols-1 gap-3.5">
      <Card class="flex items-center gap-3 p-4 shadow-[3.5px_3.5px_0px_var(--neo-shadow-color)]">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-sage/30 text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)]">
          <BookOpen class="h-5 w-5" aria-hidden="true" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-bold text-ink">Materi Terstruktur</span>
          <span class="text-[11px] text-muted font-medium">Didukung modul resmi Koding dan Kecerdasan Artifisial</span>
        </div>
      </Card>

      <Card class="flex items-center gap-3 p-4 shadow-[3.5px_3.5px_0px_var(--neo-shadow-color)]">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">
          <MessageSquare class="h-5 w-5" aria-hidden="true" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-bold text-ink">Tanya Langkah demi Langkah</span>
          <span class="text-[11px] text-muted font-medium">Petunjuk terarah untuk memperkuat pemahaman mandiri</span>
        </div>
      </Card>
    </div>
  </div>

  <div class="flex items-center gap-2 text-xs text-muted">
    <CheckCircle2 class="h-4 w-4 text-primary" aria-hidden="true" />
    <span>Dirancang khusus untuk siswa SMA/SMK Kelas X</span>
  </div>
</div>

