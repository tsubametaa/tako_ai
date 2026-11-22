<script lang="ts">
  import { AdminAppLayout } from '$lib/features/admin';

  let { children } = $props();
</script>

<AdminAppLayout>
  {@render children?.()}
</AdminAppLayout>
