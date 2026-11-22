<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { buildAuthLoginUrl } from '$lib/shared/config/subdomains';
  import { authSessionController } from '$lib/features/auth';
  import {
    conversationListController,
    ChatSidebar,
    DeleteDialog,
    RenameDialog,
  } from '$lib/features/conversations';
  import { SettingsModal, type SettingsTab } from '$lib/features/settings';
  import AppShell from '../components/AppShell.svelte';
  import { drawerController } from '../state/drawer.svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let settingsOpen = $state(false);
  let settingsActiveTab = $state<SettingsTab>('settings');

  const userDisplayName = $derived(
    authSessionController.user?.name || 'Siswa Kelas X',
  );
  const userUsername = $derived(
    authSessionController.user?.username ||
      authSessionController.user?.email ||
      'siswa.x01',
  );
  const userClassName = $derived(authSessionController.user?.className || '');
  const userGradeLevel = $derived(authSessionController.user?.gradeLevel || '');
  const userRole = $derived(authSessionController.user?.role || 'student');
  const userSubtitle = $derived(
    authSessionController.user
      ? `@${userUsername} • ${userClassName || (userRole === 'teacher' ? 'Guru' : 'Siswa')}`
      : 'KKA',
  );

  onMount(async () => {
    drawerController.init();
    await authSessionController.init();
    if (!authSessionController.isAuthenticated) {
      const loginUrl = buildAuthLoginUrl(page.url, page.url.pathname);
      if (loginUrl.startsWith('/')) {
        await goto(loginUrl);
        return;
      }
      window.location.href = loginUrl;
      return;
    }
    await conversationListController.load();
  });

  async function handleSelect(id: string) {
    drawerController.closeDrawer();
    await goto(`/chat/${id}`);
  }

  async function handleNewChat() {
    drawerController.closeDrawer();
    await goto('/chat');
  }

  async function handleDeleteConfirm() {
    const deletedId = await conversationListController.confirmDelete();
    if (deletedId && page.url.pathname.includes(deletedId)) {
      await goto('/chat');
    }
  }

  async function handleLogout() {
    drawerController.closeDrawer();
    await authSessionController.logout();
    const loginUrl = buildAuthLoginUrl(page.url);
    if (loginUrl.startsWith('/')) {
      await goto(loginUrl);
      return;
    }
    window.location.href = loginUrl;
  }
</script>

<AppShell>
  {#snippet sidebar()}
    <ChatSidebar
      groups={conversationListController.groups}
      activeId={conversationListController.activeId}
      searchQuery={conversationListController.searchQuery}
      userName={userDisplayName}
      {userSubtitle}
      onsearch={(q) => conversationListController.onSearchInput(q)}
      onnewchat={handleNewChat}
      onselect={handleSelect}
      onrename={(conv) => conversationListController.openRename(conv)}
      ondelete={(conv) => conversationListController.openDelete(conv)}
      onclose={() => drawerController.closeDrawer()}
      oncollapse={() => drawerController.collapseDesktop()}
      onopensettings={(tab) => {
        settingsActiveTab = tab;
        settingsOpen = true;
        drawerController.closeDrawer();
      }}
      onlogout={handleLogout}
    />
  {/snippet}

  {#if children}
    {@render children()}
  {/if}
</AppShell>

<RenameDialog
  conversation={conversationListController.renameTarget}
  oncancel={() => conversationListController.closeRename()}
  onsave={(title) => conversationListController.confirmRename(title)}
/>

<DeleteDialog
  conversation={conversationListController.deleteTarget}
  oncancel={() => conversationListController.closeDelete()}
  onconfirm={handleDeleteConfirm}
/>

<SettingsModal
  open={settingsOpen}
  activeTab={settingsActiveTab}
  {userDisplayName}
  {userUsername}
  {userClassName}
  {userGradeLevel}
  {userRole}
  onclose={() => (settingsOpen = false)}
/>
