<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowRight } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import {
    extractDisplayName,
    getTimeGreeting,
    STARTER_PROMPTS,
  } from '../../domain/greeting';

  interface Props {
    userName?: string | null;
    onselectexample?: (text: string) => void;
  }

  let { userName = null, onselectexample }: Props = $props();

  let now = $state(new Date());

  const displayName = $derived(extractDisplayName(userName));
  const greeting = $derived(getTimeGreeting(now));

  onMount(() => {
    now = new Date();
    const timer = window.setInterval(() => {
      now = new Date();
    }, 60_000);
    return () => window.clearInterval(timer);
  });
</script>

<div class="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-8">
  <h2
    in:fly={{ y: 12, duration: 300, delay: 45, easing: cubicOut }}
    class="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl"
  >
    <span>{greeting.salutation},</span>
    <span
      class="inline-block -rotate-1 rounded-xl border-2 border-line bg-mustard px-3 py-0.5 text-on-mustard shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-transform duration-200 hover:rotate-0"
    >
      {displayName}!
    </span>
  </h2>

  <p
    in:fly={{ y: 10, duration: 300, delay: 90, easing: cubicOut }}
    class="mt-3 max-w-lg text-sm leading-relaxed font-medium text-muted sm:text-[15px]"
  >
    {greeting.subtitle}
  </p>

  <div class="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
    {#each STARTER_PROMPTS as item, idx}
      <button
        type="button"
        in:fly={{ y: 14, duration: 280, delay: 125 + idx * 50, easing: cubicOut }}
        class="neo-control group flex min-h-[68px] items-center justify-between gap-3 rounded-xl border-2 border-line bg-surface px-4 py-3 text-left transition hover:bg-mustard-soft"
        onclick={() => onselectexample?.(item.question)}
      >
        <span class="flex min-w-0 flex-col gap-1">
          <span class="text-[10px] font-extrabold tracking-wider text-primary uppercase">
            {item.topic}
          </span>
          <span class="line-clamp-2 text-xs leading-snug font-bold text-ink sm:text-[13px]">
            {item.question}
          </span>
        </span>
        <ArrowRight
          class="h-4 w-4 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-1 group-hover:text-ink"
          aria-hidden="true"
        />
      </button>
    {/each}
  </div>
</div>
