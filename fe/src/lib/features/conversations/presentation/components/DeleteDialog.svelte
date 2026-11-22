<script lang="ts">
  import { Button, Dialog } from '$lib/shared/ui';
  import type { Conversation } from '../../domain/conversation';

  interface Props {
    conversation: Conversation | null;
    oncancel: () => void;
    onconfirm: () => void;
  }

  let { conversation, oncancel, onconfirm }: Props = $props();
</script>

<Dialog
  open={Boolean(conversation)}
  title="Hapus percakapan ini?"
  onclose={oncancel}
>
  <p class="text-sm text-ink leading-relaxed">
    Percakapan <strong class="text-ink font-semibold">"{conversation?.title}"</strong> beserta seluruh pesan di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.
  </p>

  {#snippet footer()}
    <Button variant="secondary" size="sm" onclick={oncancel}>Batal</Button>
    <Button variant="danger" size="sm" onclick={onconfirm}>Hapus</Button>
  {/snippet}
</Dialog>

