<script lang="ts">
  import { ChatAppLayout } from '$lib/features/shell';

  let { children } = $props();
</script>

<ChatAppLayout>
  {@render children?.()}
</ChatAppLayout>

