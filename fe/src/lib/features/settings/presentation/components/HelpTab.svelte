<script lang="ts">
  import { BookOpen, Info } from '@lucide/svelte';
</script>

<div class="flex flex-col gap-3.5">
  <div class="rounded-xl border-2 border-line bg-surface-soft p-4 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
    <h3 class="flex items-center gap-2 text-xs font-extrabold text-ink">
      <BookOpen class="h-4 w-4 text-mustard" aria-hidden="true" />
      <span>Cara Menggunakan NEKO AI</span>
    </h3>
    <ul class="mt-2.5 flex flex-col gap-2 text-xs text-muted leading-relaxed list-disc list-inside">
      <li>Tanyakan konsep yang belum dipahami (misal: variabel, percabangan, data latih vs uji).</li>
      <li>Minta NEKO AI memberikan analogi atau contoh kode sederhana jika masih bingung.</li>
      <li>Buka panel referensi dokumen di bawah jawaban untuk menelaah bab buku teks resmi.</li>
    </ul>
  </div>

  <div class="rounded-xl border-2 border-line bg-surface p-4 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
    <div class="flex items-center gap-2 text-xs font-bold text-ink">
      <Info class="h-4 w-4 text-mustard" aria-hidden="true" />
      <span>Penting untuk Diingat</span>
    </div>
    <p class="mt-1 text-xs text-muted leading-relaxed">
      Jawaban NEKO AI ditujukan sebagai pendamping belajar mandiri. Selalu konfirmasi hasil belajar dan tugas resmi kepada guru mata pelajaran KKA di sekolahmu.
    </p>
  </div>
</div>

