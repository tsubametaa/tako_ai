<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet;
    class?: string;
  }

  let { children, class: className = '', ...restProps }: Props = $props();
</script>

<div class="neo-box p-5 md:p-6 {className}" {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</div>
