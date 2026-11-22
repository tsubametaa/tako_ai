<script lang="ts">
  import { Button, Dialog, Input } from '$lib/shared/ui';
  import type { Conversation } from '../../domain/conversation';

  interface Props {
    conversation: Conversation | null;
    oncancel: () => void;
    onsave: (newTitle: string) => void;
  }

  let { conversation, oncancel, onsave }: Props = $props();

  let titleInput = $state('');

  $effect(() => {
    if (conversation) {
      titleInput = conversation.title;
    }
  });

  function handleSubmit() {
    const trimmed = titleInput.trim();
    if (trimmed) onsave(trimmed);
  }
</script>

<Dialog
  open={Boolean(conversation)}
  title="Ubah Judul Percakapan"
  onclose={oncancel}
>
  <div class="flex flex-col gap-2">
    <label for="rename-input" class="text-xs font-medium text-muted">
      Judul baru (maks. 100 karakter)
    </label>
    <Input
      id="rename-input"
      bind:value={titleInput}
      maxlength={100}
      placeholder="Masukkan judul percakapan..."
      onkeydown={(e) => {
        if (e.key === 'Enter') handleSubmit();
      }}
    />
  </div>

  {#snippet footer()}
    <Button variant="secondary" size="sm" onclick={oncancel}>Batal</Button>
    <Button
      variant="primary"
      size="sm"
      disabled={!titleInput.trim()}
      onclick={handleSubmit}
    >
      Simpan
    </Button>
  {/snippet}
</Dialog>

