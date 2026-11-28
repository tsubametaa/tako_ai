<script lang="ts">
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';

  interface Props {
    content: string;
    compact?: boolean;
  }

  let { content, compact = false }: Props = $props();

  function renderSanitized(markdown: string): string {
    if (typeof window === 'undefined') {
      return markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    try {
      const rawHtml = marked.parse(markdown, {
        async: false,
        breaks: true,
        gfm: true,
      }) as string;
      return DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
      });
    } catch {
      return markdown;
    }
  }

  const html = $derived(renderSanitized(content));
</script>

<div
  class="prose prose-sm prose-neko neko-markdown max-w-none {compact
    ? 'neko-markdown--compact font-bold'
    : 'font-medium'}"
>
  {@html html}
</div>
