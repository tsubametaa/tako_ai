<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { authSessionController } from '$lib/features/auth';
  import { conversationListController } from '$lib/features/conversations';
  import { drawerController, ChatHeader } from '$lib/features/shell';
  import { ComposerController } from '../state/composer.svelte';
  import { roomStateController } from '../state/roomState.svelte';
  import GenerationStatusIndicator from '../components/GenerationStatusIndicator.svelte';
  import MessageComposer from '../components/MessageComposer.svelte';
  import MessageList from '../components/MessageList.svelte';

  interface Props {
    conversationId: string;
  }

  let { conversationId }: Props = $props();

  const composer = new ComposerController();

  const currentTitle = $derived(
    conversationListController.conversations.find((c) => c.id === conversationId)
      ?.title || 'Ruang Percakapan',
  );

  const combinedError = $derived(
    composer.errorMessage ?? roomStateController.errorMessage,
  );

  $effect(() => {
    const targetId = conversationId;
    if (!targetId) return;
    untrack(() => {
      void roomStateController.setRoom(targetId);
      conversationListController.activeId = targetId;
    });
  });

  onMount(() => {
    composer.init();
    conversationListController.activeId = conversationId;
  });

  async function handleSend() {
    if (!composer.canSubmit) return;
    const content = composer.text;
    const attachments = [...composer.attachments];
    const mode = composer.mode;
    composer.clear();
    await roomStateController.send(
      content,
      attachments,
      undefined,
      (updated) => {
        conversationListController.upsert(updated);
      },
      mode,
    );
  }
</script>

<svelte:head>
  <title>{currentTitle} - NEKO AI</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col overflow-hidden">
  <ChatHeader
    title={currentTitle}
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
    onretry={() => roomStateController.reload()}
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
