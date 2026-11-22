<script lang="ts">
  import { ArrowDown, BookOpen } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { magnetic } from '$lib/shared/motion';
  import TechText from './TechText.svelte';

  interface Props {
    aboutHref?: string;
  }

  let { aboutHref = '#tentang' }: Props = $props();
</script>

<section
  id="hero"
  aria-labelledby="hero-title"
  class="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col items-center justify-center gap-8 px-4 py-12 md:min-h-[calc(100dvh-4.5rem)] md:gap-10 md:px-6"
>
  <h1 id="hero-title" class="sr-only">TAKO AI</h1>

  <div class="h-[200px] w-full sm:h-[270px] md:h-[340px] lg:h-[380px]">
    <TechText
      text="TAKO AI"
      fontWeight={800}
      fontSize={210}
      letterSpacing={-0.04}
      color="var(--text)"
      accentColor="var(--primary)"
      shadowColor="var(--mustard)"
      shadowOffset={6}
      reveal="letter"
      dashLength={6}
      dashGap={3}
      strokeWidth={2}
      specks={15}
      intro="none"
      clickKick
      guides={false}
      reach={200}
      softness={0.7}
      lineStyle="dashed"
      speed={1}
      bounce={0.42}
      selection
      labels
      align="center"
      draggable
      sweep
    />
  </div>

  <div in:fly={{ y: 14, duration: 380, delay: 120, easing: cubicOut }}>
    <a
      href={aboutHref}
      use:magnetic={{ strength: 5 }}
      class="neo-control group inline-flex min-h-[54px] items-center justify-center gap-2.5 bg-mustard px-8 py-3.5 text-base font-extrabold tracking-tight text-on-mustard shadow-[4px_4px_0px_var(--neo-shadow-color)] md:text-lg"
    >
      <BookOpen class="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>Pelajari TAKO AI</span>
      <ArrowDown
        class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-y-1"
        aria-hidden="true"
      />
    </a>
  </div>
</section>
