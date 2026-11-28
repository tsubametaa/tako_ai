<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authSessionController } from '$lib/features/auth';
  import { conversationListController } from '$lib/features/conversations';
  import { drawerController, ChatHeader } from '$lib/features/shell';
  import { ComposerController } from '../state/composer.svelte';
  import { roomStateController } from '../state/roomState.svelte';
  import GenerationStatusIndicator from '../components/GenerationStatusIndicator.svelte';
  import MessageComposer from '../components/MessageComposer.svelte';
  import MessageList from '../components/MessageList.svelte';

  const composer = new ComposerController();

  const combinedError = $derived(
    composer.errorMessage ?? roomStateController.errorMessage,
  );

  onMount(() => {
    composer.init();
    roomStateController.setRoom(null);
  });

  async function handleSend() {
    if (!composer.canSubmit) return;
    const content = composer.text;
    const attachments = [...composer.attachments];
    const mode = composer.mode;
    composer.clear();

    const titleCandidate =
      content.trim() ||
      (attachments[0] ? `Diskusi: ${attachments[0].name}` : 'Percakapan Baru');

    await roomStateController.send(
      content,
      attachments,
      async () => {
        const created = await conversationListController.createNew(
          titleCandidate.slice(0, 60),
        );
        conversationListController.activeId = created.id;
        return created.id;
      },
      (updated) => {
        conversationListController.upsert(updated);
      },
      mode,
    );

    if (roomStateController.conversationId) {
      await goto(`/chat/${roomStateController.conversationId}`, {
        replaceState: true,
      });
    }
  }
</script>

<svelte:head>
  <title>Percakapan Baru - NEKO AI</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col overflow-hidden">
  <ChatHeader
    title="Percakapan Baru"
    onopenmenu={() => drawerController.openDrawer()}
  />

  <GenerationStatusIndicator status={roomStateController.status} />

  <MessageList
    messages={roomStateController.messages}
    streamingMessage={roomStateController.streamingMessage}
    status={roomStateController.status}
    userScrolledUp={roomStateController.userScrolledUp}
    userName={authSessionController.user?.name}
    onselectexample={(example) => composer.setText(example)}
    onscroll={(e) => roomStateController.onScroll(e.currentTarget as HTMLElement)}
    onscrolltobottom={() => {
      roomStateController.userScrolledUp = false;
    }}
  />

  <MessageComposer
    text={composer.text}
    attachments={composer.attachments}
    deepThink={composer.deepThink}
    errorMessage={combinedError}
    isBusy={roomStateController.isBusy}
    canSubmit={composer.canSubmit}
    oninput={(v) => composer.setText(v)}
    ontoggledeepthink={() => composer.toggleDeepThink()}
    onfileselected={(files) => composer.addFiles(files)}
    onremoveattachment={(id) => composer.removeAttachment(id)}
    onclearerror={() => {
      composer.clearErrorMessage();
      roomStateController.clearError();
    }}
    onsend={handleSend}
    onstop={() => roomStateController.stop()}
    onkeydown={(e) => composer.handleKeydown(e, handleSend)}
    oncompositionstart={() => composer.onCompositionStart()}
    oncompositionend={() => composer.onCompositionEnd()}
  />
</div>
