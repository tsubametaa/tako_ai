<script lang="ts">
  import { page } from '$app/state';
  import { ErrorPage } from '$lib/features/shell';
</script>

<ErrorPage status={page.status} message={page.error?.message} />
