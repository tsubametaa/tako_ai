<script lang="ts">
  import { ArrowRight, BookOpen, MessagesSquare, SlidersHorizontal } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { magnetic, reveal } from '$lib/shared/motion';
  import { NekoMark } from '$lib/shared/ui';
  import type {
    AboutCapability,
    AboutDialogueExample,
  } from '../../domain/homeContent';

  interface Props {
    chatHref: string;
    dialogues: AboutDialogueExample[];
    capabilities: AboutCapability[];
  }

  let { chatHref, dialogues, capabilities }: Props = $props();

  let activeIndex = $state(0);
  let tabButtons = $state<Array<HTMLButtonElement | null>>([]);

  const activeDialogue = $derived(dialogues[activeIndex] ?? dialogues[0]);

  function activateTab(nextIndex: number, moveFocus = false) {
    activeIndex = nextIndex;
    if (moveFocus) tabButtons[nextIndex]?.focus();
  }

  function handleTabKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      activateTab((index + 1) % dialogues.length, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      activateTab((index - 1 + dialogues.length) % dialogues.length, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      activateTab(0, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      activateTab(dialogues.length - 1, true);
    }
  }
</script>

<section
  id="tentang"
  aria-labelledby="tentang-heading"
  class="scroll-mt-20 bg-background"
>
  <div class="mx-auto flex max-w-6xl flex-col gap-9 px-4 pt-6 pb-14 sm:gap-12 sm:pt-8 sm:pb-16 md:gap-16 md:px-6 md:pt-12 md:pb-24">
    <div class="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div
        use:reveal={{ y: 20, delay: 0 }}
        class="flex flex-col gap-3 sm:gap-4 lg:col-span-5"
      >
        <h2
          id="tentang-heading"
          class="text-[1.6rem] leading-[1.2] font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl md:leading-tight"
        >
          Teman Belajar Koding & Kecerdasan Artifisial untuk Kelas X
        </h2>
        <p class="text-[13.5px] leading-relaxed font-medium text-muted sm:text-base">
          NEKO AI dibuat khusus buat siswa SMA/SMK yang sedang belajar Koding dan Kecerdasan Artifisial (KKA). Alih-alih langsung menyuapi jawaban jadi, NEKO mengajak kamu berdiskusi langkah demi langkah supaya konsepnya benar-benar masuk akal.
        </p>
        <p class="text-[13.5px] leading-relaxed font-medium text-muted sm:text-base">
          Setiap penjelasan terhubung dengan materi kurikulum yang dikelola guru, jadi kamu bisa belajar mandiri, latihan berpikir komputasional, dan cek langsung rujukan babnya.
        </p>
      </div>

      <div use:reveal={{ y: 24, delay: 110 }} class="lg:col-span-7">
        <div class="motion-card flex flex-col gap-3.5 rounded-2xl border-2 border-line bg-surface p-4 shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:gap-4 sm:p-6 sm:shadow-[4px_4px_0px_var(--neo-shadow-color)]">
          <div class="flex flex-col gap-2.5 sm:gap-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold tracking-tight text-ink sm:text-sm">
                Simulasi Cara NEKO Membimbing
              </span>
              <span class="text-[11px] font-semibold text-muted sm:hidden">
                {activeIndex + 1}/{dialogues.length}
              </span>
            </div>

            <div
              role="tablist"
              aria-label="Contoh topik diskusi KKA"
              class="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:rounded-xl sm:border sm:border-line/20 sm:bg-surface-soft sm:p-1"
            >
              {#each dialogues as item, idx}
                <button
                  bind:this={tabButtons[idx]}
                  type="button"
                  role="tab"
                  id="tab-{item.id}"
                  aria-selected={activeIndex === idx}
                  aria-controls="panel-{item.id}"
                  tabindex={activeIndex === idx ? 0 : -1}
                  class="min-h-[36px] shrink-0 whitespace-nowrap rounded-lg border-2 px-3 py-1.5 text-center text-xs font-bold transition-all duration-150 active:scale-[0.98] sm:min-h-[38px] sm:shrink sm:whitespace-normal {activeIndex === idx
                    ? 'border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]'
                    : 'border-line/20 bg-surface-soft text-muted hover:text-ink sm:border-transparent sm:bg-transparent'}"
                  onclick={() => activateTab(idx)}
                  onkeydown={(e) => handleTabKeydown(e, idx)}
                >
                  {item.tabLabel}
                </button>
              {/each}
            </div>
          </div>

          {#if activeDialogue}
            {#key activeDialogue.id}
              <div
                id="panel-{activeDialogue.id}"
                role="tabpanel"
                aria-labelledby="tab-{activeDialogue.id}"
                class="flex flex-col gap-2.5 pt-0.5 sm:gap-3 sm:pt-1"
              >
                <div
                  in:fly={{ x: 14, y: 6, duration: 240, easing: cubicOut }}
                  class="ml-auto max-w-[90%] rounded-2xl rounded-br-sm border-2 border-line bg-primary px-3.5 py-2.5 text-[13px] leading-snug font-semibold text-on-primary sm:max-w-[85%] sm:rounded-xl sm:px-4 sm:text-sm"
                >
                  {activeDialogue.question}
                </div>

                <div
                  in:fly={{ x: -12, y: 8, duration: 280, delay: 75, easing: cubicOut }}
                  class="flex w-full flex-col gap-2.5 rounded-2xl rounded-bl-sm border-2 border-line bg-surface-soft p-3.5 text-[13px] leading-relaxed text-ink sm:mr-auto sm:max-w-[94%] sm:gap-3 sm:rounded-xl sm:p-4 sm:text-sm"
                >
                  <div class="flex items-center gap-2">
                    <NekoMark size="xs" />
                    <span class="text-[11px] font-extrabold tracking-wide text-muted uppercase">
                      NEKO AI
                    </span>
                  </div>

                  <p class="font-medium">{activeDialogue.reply}</p>

                  <p class="rounded-r-lg border border-line/20 border-l-[3px] border-l-mustard bg-surface px-3 py-2 text-[13px] leading-snug font-bold text-ink sm:px-3.5 sm:py-2.5 sm:text-sm">
                    {activeDialogue.promptBack}
                  </p>

                  <div class="inline-flex w-fit max-w-full items-center gap-1.5 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1 text-[11px] leading-snug font-bold text-ink sm:text-xs">
                    <BookOpen class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{activeDialogue.sourceLabel}</span>
                  </div>
                </div>
              </div>
            {/key}
          {/if}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
      <div
        use:reveal={{ y: 22, delay: 60 }}
        class="motion-card flex flex-col justify-between gap-5 rounded-2xl border-2 border-line bg-mustard p-5 text-on-mustard shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:gap-6 sm:p-6 sm:shadow-[4px_4px_0px_var(--neo-shadow-color)] md:p-7 lg:col-span-5"
      >
        <div class="flex flex-col gap-2.5 sm:gap-3">
          <h3 class="text-lg leading-snug font-extrabold tracking-tight sm:text-xl md:text-2xl">
            Bikin Paham Konsep, Bukan Sekadar Copy-Paste
          </h3>
          <p class="text-[13.5px] leading-relaxed font-semibold sm:text-sm md:text-base">
            NEKO memandu proses berpikir kamu dari pertanyaan pemantik, petunjuk bertahap, sampai latihan menjelaskan kembali dengan bahasa sendiri.
          </p>
        </div>

        <div>
          <a
            href={chatHref}
            use:magnetic={{ strength: 4 }}
            class="neo-control group inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-surface px-5 py-2.5 text-sm font-extrabold text-ink hover:bg-surface-soft sm:w-auto"
          >
            <span>Coba Tanya NEKO Sekarang</span>
            <ArrowRight
              class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      <ul
        use:reveal={{ y: 22, delay: 140 }}
        class="divide-y divide-line/20 overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:shadow-[4px_4px_0px_var(--neo-shadow-color)] lg:col-span-7"
      >
        {#each capabilities as item}
          <li class="group flex items-start gap-3.5 p-4 transition-colors duration-150 hover:bg-surface-soft/60 sm:gap-4 sm:p-5 md:p-6">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface-soft text-ink transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-mustard group-hover:text-on-mustard group-hover:shadow-[2px_2px_0px_var(--neo-shadow-color)] sm:h-11 sm:w-11">
              {#if item.id === 'sources'}
                <BookOpen class="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden="true" />
              {:else if item.id === 'personalization'}
                <SlidersHorizontal class="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden="true" />
              {:else}
                <MessagesSquare class="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden="true" />
              {/if}
            </div>
            <div class="flex flex-col gap-1">
              <h3 class="text-[15px] leading-snug font-extrabold text-ink sm:text-base">
                {item.title}
              </h3>
              <p class="text-[13px] leading-relaxed font-medium text-muted sm:text-sm">
                {item.description}
              </p>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
