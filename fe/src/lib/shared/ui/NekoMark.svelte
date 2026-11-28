<script lang="ts">
  type MarkSize = 'xs' | 'sm' | 'md' | 'lg';
  type MarkVariant = 'accent' | 'primary' | 'surface';

  interface Props {
    size?: MarkSize;
    variant?: MarkVariant;
    class?: string;
    ariaHidden?: boolean;
  }

  let {
    size = 'sm',
    variant = 'accent',
    class: className = '',
    ariaHidden = true,
  }: Props = $props();

  const boxSizes: Record<MarkSize, string> = {
    xs: 'h-6 w-6 rounded-md border shadow-none',
    sm: 'h-8 w-8 rounded-xl border-2 shadow-[2px_2px_0px_var(--neo-shadow-color)]',
    md: 'h-9 w-9 rounded-xl border-2 shadow-[2px_2px_0px_var(--neo-shadow-color)]',
    lg: 'h-10 w-10 rounded-xl border-2 shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]',
  };

  const iconSizes: Record<MarkSize, string> = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4.5 w-4.5',
    md: 'h-5 w-5',
    lg: 'h-5.5 w-5.5',
  };

  const variantClasses: Record<MarkVariant, string> = {
    accent: 'border-line bg-mustard text-on-mustard',
    primary: 'border-line bg-primary text-on-primary',
    surface: 'border-line bg-surface text-ink',
  };
</script>

<span
  data-slot="neko-mark"
  aria-hidden={ariaHidden ? 'true' : undefined}
  class="inline-flex shrink-0 items-center justify-center {boxSizes[size]} {variantClasses[variant]} {className}"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={iconSizes[size]}
    aria-hidden="true"
  >
    <path
      d="M5 10.5L6.2 4.5C6.4 3.7 7.4 3.4 8 4L10.6 6.6C11.5 6.3 12.5 6.3 13.4 6.6L16 4C16.6 3.4 17.6 3.7 17.8 4.5L19 10.5C20 11.7 20.5 13.1 20.5 14.7C20.5 18.4 16.7 21 12 21C7.3 21 3.5 18.4 3.5 14.7C3.5 13.1 4 11.7 5 10.5Z"
      fill="currentColor"
      fill-opacity="0.16"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <circle cx="9.2" cy="13.5" r="1.15" fill="currentColor" />
    <circle cx="14.8" cy="13.5" r="1.15" fill="currentColor" />
    <path
      d="M11 16.1L12 17L13 16.1"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</span>
