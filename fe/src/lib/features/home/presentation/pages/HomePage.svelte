<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { themeController } from '$lib/features/theme';
  import {
    buildAuthLoginUrl,
    buildSiteUrl,
  } from '$lib/shared/config/subdomains';
  import {
    ABOUT_CAPABILITIES,
    ABOUT_DIALOGUES,
    FOOTER_COPYRIGHT,
  } from '../../domain/homeContent';
  import HomeAbout from '../components/HomeAbout.svelte';
  import HomeHero from '../components/HomeHero.svelte';
  import HomeNavbar from '../components/HomeNavbar.svelte';

  let scrollY = $state(0);

  const isScrolled = $derived(scrollY > 16);
  const homeHref = $derived(buildSiteUrl('home', page.url, '/'));
  const chatHref = $derived(buildSiteUrl('chat', page.url, '/'));
  const loginHref = $derived(buildAuthLoginUrl(page.url));

  onMount(() => {
    themeController.init();
    return () => themeController.destroy();
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>TAKO AI - Teman Belajar Koding dan AI Kelas X</title>
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background text-ink">
  <HomeNavbar
    {homeHref}
    {loginHref}
    scrolled={isScrolled}
    themeResolved={themeController.resolved}
    ontoggletheme={() => themeController.toggleDayDark()}
  />

  <main class="flex-1">
    <HomeHero aboutHref="#tentang" />
    <HomeAbout
      {chatHref}
      dialogues={ABOUT_DIALOGUES}
      capabilities={ABOUT_CAPABILITIES}
    />
  </main>

  <footer class="px-4 py-8 md:px-6">
    <div class="mx-auto max-w-6xl text-center">
      <p class="text-xs font-semibold text-muted">{FOOTER_COPYRIGHT}</p>
    </div>
  </footer>
</div>
