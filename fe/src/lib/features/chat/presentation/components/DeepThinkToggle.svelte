<script lang="ts">
  import { Brain } from '@lucide/svelte';

  interface Props {
    active?: boolean;
    disabled?: boolean;
    ontoggle?: () => void;
  }

  let { active = false, disabled = false, ontoggle }: Props = $props();

  let justActivated = $state(false);
  let popTimer: ReturnType<typeof setTimeout> | undefined;

  function handleClick() {
    if (disabled) return;
    if (!active) {
      justActivated = true;
      if (popTimer) clearTimeout(popTimer);
      popTimer = setTimeout(() => {
        justActivated = false;
      }, 600);
    } else {
      justActivated = false;
    }
    ontoggle?.();
  }

  $effect(() => {
    return () => {
      if (popTimer) clearTimeout(popTimer);
    };
  });
</script>

<button
  type="button"
  data-slot="deep-think-toggle"
  data-state={active ? 'on' : 'off'}
  aria-pressed={active}
  aria-label={active
    ? 'Deep Think aktif (Mode Terstruktur). Klik untuk matikan.'
    : 'Aktifkan Deep Think (Mode Terstruktur)'}
  title={active
    ? 'Deep Think aktif: NEKO membimbing bertahap langkah demi langkah'
    : 'Aktifkan Deep Think (Mode Terstruktur)'}
  {disabled}
  onclick={handleClick}
  class="group relative inline-flex h-10 shrink-0 touch-manipulation select-none items-center justify-center overflow-hidden rounded-full border-2 text-xs font-extrabold transition-[background-color,border-color,box-shadow,color,padding,transform] duration-200 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 motion-reduce:transition-none {active
    ? 'border-line bg-mustard-soft px-3 text-ink shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3.5px_3.5px_0px_var(--neo-shadow-color)] dark:border-mustard/80 dark:bg-mustard-soft dark:text-mustard'
    : 'w-10 border-line/35 bg-surface px-0 text-muted shadow-none hover:border-line hover:bg-surface-soft hover:text-ink hover:shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)] sm:w-9'}"
>
  <span
    class="relative inline-flex shrink-0 items-center justify-center {justActivated
      ? 'deep-think-pop'
      : ''}"
  >
    <Brain
      class="h-4 w-4 transition-colors duration-200 motion-reduce:transition-none sm:h-3.5 sm:w-3.5 {active
        ? 'text-amber-700 dark:text-mustard'
        : 'group-hover:scale-105'}"
      aria-hidden="true"
    />
  </span>

  <!-- Mode Pill reveal: 0fr (hanya ikon) -> 1fr (ikon + Deep Think shimmer) -->
  <span
    aria-hidden={!active}
    class="grid overflow-hidden transition-[grid-template-columns,opacity,margin] duration-250 ease-out motion-reduce:transition-none {active
      ? 'ml-1.5 grid-cols-[1fr] opacity-100'
      : 'ml-0 grid-cols-[0fr] opacity-0'}"
  >
    <span class="min-w-0 overflow-hidden whitespace-nowrap">
      <span
        class="inline-block tracking-tight {active ? 'deep-think-shimmer' : ''}"
      >
        Deep Think
      </span>
    </span>
  </span>
</button>

<style>
  @keyframes deep-think-pop {
    0% {
      transform: scale(1) rotate(0deg);
    }
    35% {
      transform: scale(1.24) rotate(-10deg);
    }
    70% {
      transform: scale(0.95) rotate(4deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes deep-think-shimmer-sweep {
    0% {
      background-position: 120% 50%;
    }
    100% {
      background-position: -120% 50%;
    }
  }

  .deep-think-pop {
    animation: deep-think-pop 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Terinspirasi utilitas shimmer shadcn-svelte dengan adaptasi Day & Night */
  .deep-think-shimmer {
    color: transparent;
    background-image: linear-gradient(
      110deg,
      #18181b 35%,
      #b45309 50%,
      #18181b 65%
    );
    background-size: 240% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    animation: deep-think-shimmer-sweep 2.2s linear infinite;
  }

  :global(html[data-theme='dark']) .deep-think-shimmer {
    background-image: linear-gradient(
      110deg,
      #f59e0b 35%,
      #fef3c7 50%,
      #f59e0b 65%
    );
  }

  @media (prefers-reduced-motion: reduce) {
    .deep-think-pop,
    .deep-think-shimmer {
      animation: none !important;
    }

    .deep-think-shimmer {
      color: currentColor;
      background-image: none;
    }
  }
</style>
