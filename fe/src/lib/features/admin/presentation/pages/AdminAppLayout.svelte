<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { authSessionController } from '$lib/features/auth';
  import { drawerController } from '$lib/features/shell';
  import { themeController } from '$lib/features/theme';
  import {
    buildAuthLoginUrl,
    buildSitePath,
    buildSiteUrl,
    normalizeSitePathname,
  } from '$lib/shared/config/subdomains';
  import { ADMIN_SECTIONS } from '../../domain/navigation';
  import AdminShell, { type AdminNavLink } from '../components/AdminShell.svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  let authChecked = $state(false);

  const activeSubPath = $derived(
    normalizeSitePathname('admin', page.url.pathname),
  );

  const navItems = $derived<AdminNavLink[]>(
    ADMIN_SECTIONS.map((section) => ({
      id: section.id,
      href: buildSitePath('admin', page.url, section.subPath),
      label: section.label,
      active: activeSubPath === section.subPath,
    })),
  );

  const activeTitle = $derived(
    ADMIN_SECTIONS.find((section) => section.subPath === activeSubPath)?.title ??
      'Panel Admin & Guru',
  );

  const homeHref = $derived(buildSiteUrl('home', page.url, '/'));
  const chatHref = $derived(buildSiteUrl('chat', page.url, '/'));
  const loginHref = $derived(
    buildAuthLoginUrl(
      page.url,
      buildSiteUrl('admin', page.url, activeSubPath),
    ),
  );

  const userName = $derived(authSessionController.user?.name || 'Guru Pengampu');
  const userSubtitle = $derived(
    authSessionController.user?.username
      ? `@${authSessionController.user.username} • Guru`
      : 'Guru Pengampu KKA',
  );

  async function navigateTo(target: string) {
    if (target.startsWith('/')) {
      await goto(target);
      return;
    }
    window.location.href = target;
  }

  onMount(async () => {
    drawerController.init();
    themeController.init();
    await authSessionController.init();

    if (!authSessionController.isAuthenticated) {
      await navigateTo(loginHref);
      return;
    }

    if (authSessionController.user?.role !== 'teacher') {
      await navigateTo(chatHref);
      return;
    }

    authChecked = true;
  });

  async function handleLogout() {
    await authSessionController.logout();
    await navigateTo(buildAuthLoginUrl(page.url));
  }
</script>

{#if authChecked}
  <AdminShell
    title={activeTitle}
    {navItems}
    {homeHref}
    {chatHref}
    {loginHref}
    {userName}
    {userSubtitle}
    isAuthenticated={authSessionController.isAuthenticated}
    desktopCollapsed={drawerController.desktopCollapsed}
    themePreference={themeController.preference}
    themeResolved={themeController.resolved}
    oncycletheme={() => themeController.cycleTheme()}
    oncollapse={() => drawerController.collapseDesktop()}
    onexpand={() => drawerController.extendDesktop()}
    onlogout={handleLogout}
  >
    {#if children}
      {@render children()}
    {/if}
  </AdminShell>
{:else}
  <div class="flex min-h-dvh items-center justify-center bg-background text-sm font-semibold text-muted">
    Memverifikasi akses guru NEKO AI…
  </div>
{/if}
