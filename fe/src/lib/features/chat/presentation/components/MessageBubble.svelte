<script lang="ts">
  import { Check, Clock, Copy } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import {
    ContextTopicBadges,
    extractContextTopics,
    SourceChip,
    SourcePanel,
  } from '$lib/features/sources';
  import type { GenerationStatus } from '../../domain/generation';
  import type { Message } from '../../domain/message';
  import { splitGuidingQuestion } from '../../domain/responseFormat';
  import AttachmentChip from './AttachmentChip.svelte';
  import MessageMarkdown from './MessageMarkdown.svelte';
  import TakoThinkingStatus from './TakoThinkingStatus.svelte';

  interface Props {
    message: Message;
    status?: GenerationStatus;
  }

  let { message, status = 'idle' }: Props = $props();

  let copied = $state(false);
  let showSources = $state(false);

  const parsedResponse = $derived(
    message.role === 'assistant' && !message.isStreaming && message.content
      ? splitGuidingQuestion(message.content)
      : { body: message.content, guidingQuestion: null },
  );

  const primarySourceTitle = $derived(message.sources?.[0]?.title);
  const contextTopics = $derived(extractContextTopics(message.sources));

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  }
</script>

<div
  in:fly={{
    x: message.role === 'user' ? 12 : -10,
    y: 8,
    duration: 220,
    easing: cubicOut,
  }}
  class="flex w-full {message.role === 'user' ? 'justify-end' : 'justify-start'}"
>
  {#if message.role === 'user'}
    <div
      class="flex max-w-[88%] flex-col gap-2 rounded-2xl rounded-br-sm border-2 border-line bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)] md:max-w-[75%]"
    >
      {#if message.attachments && message.attachments.length > 0}
        <div class="flex flex-wrap gap-1.5 pb-1">
          {#each message.attachments as att (att.id)}
            <AttachmentChip attachment={att} />
          {/each}
        </div>
      {/if}

      {#if message.content}
        <p class="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      {/if}
    </div>
  {:else}
    <div class="flex w-full max-w-[96%] flex-col md:max-w-[86%]">
      <div
        class="flex flex-col gap-3 rounded-2xl rounded-bl-sm border-2 border-line bg-surface-soft p-4 shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:p-5"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-mustard text-[11px] font-extrabold text-on-mustard"
              aria-hidden="true"
            >
              T
            </span>
            <span class="text-[11px] font-extrabold tracking-wide text-muted uppercase">
              TAKO AI
            </span>
            {#if message.thinkingSeconds && (!message.isStreaming || message.content)}
              <span
                class="inline-flex items-center gap-1 text-[11px] font-semibold text-muted/80"
              >
                <span aria-hidden="true">•</span>
                <Clock class="h-3 w-3" aria-hidden="true" />
                <span>Dipikirkan {message.thinkingSeconds} dtk</span>
              </span>
            {/if}
          </div>

          {#if !message.isStreaming && message.content}
            <button
              type="button"
              class="inline-flex min-h-[28px] items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs font-bold text-muted transition hover:border-line/20 hover:bg-surface hover:text-ink"
              aria-label="Salin jawaban"
              onclick={handleCopy}
            >
              {#if copied}
                <Check class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span class="font-bold text-primary">Tersalin</span>
              {:else}
                <Copy class="h-3.5 w-3.5" aria-hidden="true" />
                <span>Salin</span>
              {/if}
            </button>
          {/if}
        </div>

        {#if parsedResponse.body}
          <MessageMarkdown content={parsedResponse.body} />
        {:else if message.isStreaming}
          <TakoThinkingStatus
            {status}
            hasSources={Boolean(message.sources && message.sources.length > 0)}
          />
        {/if}

        {#if parsedResponse.guidingQuestion}
          <div
            in:fly={{ y: 6, duration: 200, easing: cubicOut }}
            class="rounded-r-lg border border-line/20 border-l-[3px] border-l-mustard bg-surface px-3.5 py-2.5 text-ink"
          >
            <MessageMarkdown content={parsedResponse.guidingQuestion} compact />
          </div>
        {/if}

        {#if message.isCancelled}
          <div class="text-xs font-semibold text-danger">
            Respons belum selesai (dihentikan)
          </div>
        {/if}

        {#if message.sources && message.sources.length > 0}
          <div class="flex flex-col gap-2 pt-0.5">
            <SourceChip
              count={message.sources.length}
              label={primarySourceTitle}
              open={showSources}
              onclick={() => (showSources = !showSources)}
            />
            <ContextTopicBadges topics={contextTopics} />
            <SourcePanel
              sources={message.sources}
              open={showSources}
              onclose={() => (showSources = false)}
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
