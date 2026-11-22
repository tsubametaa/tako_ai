<script lang="ts">
  import type {
    Conversation,
    ConversationGroup,
  } from '../../domain/conversation';
  import ConversationItem from './ConversationItem.svelte';

  interface Props {
    groups: ConversationGroup[];
    activeId?: string | null;
    onselect?: (id: string) => void;
    onrename?: (conv: Conversation) => void;
    ondelete?: (conv: Conversation) => void;
  }

  let {
    groups = [],
    activeId = null,
    onselect,
    onrename,
    ondelete,
  }: Props = $props();
</script>

<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-2">
  {#if groups.length === 0}
    <div class="p-4 text-center text-xs text-muted">
      Belum ada riwayat percakapan.
    </div>
  {:else}
    {#each groups as group (group.label)}
      <div class="flex flex-col gap-1">
        <span class="px-3 text-[11px] font-bold uppercase tracking-wider text-muted/80">
          {group.label}
        </span>
        <div class="flex flex-col gap-0.5">
          {#each group.conversations as conv (conv.id)}
            <ConversationItem
              conversation={conv}
              active={conv.id === activeId}
              {onselect}
              {onrename}
              {ondelete}
            />
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

