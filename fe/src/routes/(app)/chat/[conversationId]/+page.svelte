<script lang="ts">
  import { ChatRoomPage } from '$lib/features/chat';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<ChatRoomPage conversationId={data.conversationId} />

