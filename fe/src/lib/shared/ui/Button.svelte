<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  type ButtonSize = 'default' | 'sm' | 'icon';

  interface Props extends HTMLButtonAttributes {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children?: Snippet;
    class?: string;
  }

  let {
    variant = 'primary',
    size = 'default',
    children,
    class: className = '',
    type = 'button',
    disabled = false,
    ...restProps
  }: Props = $props();

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-primary text-on-primary font-bold hover:brightness-105',
    secondary:
      'bg-surface-soft text-ink font-semibold hover:bg-surface',
    ghost:
      'bg-transparent text-ink border-transparent shadow-none hover:bg-surface-soft active:translate-none',
    danger:
      'bg-danger text-white font-bold hover:brightness-105',
    accent:
      'bg-mustard text-on-mustard font-bold hover:brightness-105',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    default: 'min-h-[44px] px-5 py-2.5 text-base',
    sm: 'min-h-[44px] px-3.5 py-1.5 text-sm',
    icon: 'min-h-[44px] min-w-[44px] p-2.5',
  };
</script>

<button
  {type}
  {disabled}
  class="neo-control inline-flex items-center justify-center gap-2 select-none disabled:pointer-events-none disabled:opacity-50 {variantClasses[variant]} {sizeClasses[size]} {className}"
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>
