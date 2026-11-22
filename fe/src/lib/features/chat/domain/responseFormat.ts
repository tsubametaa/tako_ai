export interface SplitAssistantResponse {
  body: string;
  guidingQuestion: string | null;
}

const MAX_QUESTION_LEN = 300;
const MIN_QUESTION_LEN = 12;
const MIN_BODY_LEN = 36;

function looksLikeQuestion(text: string): boolean {
  const cleaned = text.trim().replace(/[*_`"')\]\s]+$/g, '');
  return cleaned.endsWith('?');
}

function isNonProseBlock(block: string): boolean {
  const trimmed = block.trim();
  if (!trimmed) return true;
  return (
    trimmed.startsWith('```') ||
    trimmed.endsWith('```') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('|') ||
    /^([-*+]|\d+\.)\s+/.test(trimmed)
  );
}

/**
 * Finds the last sentence boundary (`.`, `!`, or `?` followed by whitespace)
 * outside inline code spans so trailing Socratic guiding questions can be
 * highlighted cleanly in a dedicated callout box.
 */
function splitLastSentence(paragraph: string): { head: string; tail: string } | null {
  let inCode = false;
  let lastBoundary = -1;

  for (let i = 0; i < paragraph.length - 1; i++) {
    const ch = paragraph[i];
    if (ch === '`') {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    if ((ch === '.' || ch === '!' || ch === '?') && /\s/.test(paragraph[i + 1])) {
      // Skip common Indonesian abbreviations like "mis.", "dll.", "dst.", "no."
      const prefix = paragraph.slice(Math.max(0, i - 4), i + 1).toLowerCase();
      if (/(?:^|\s)(mis|dll|dst|dsb|dkk|no|dr|hlm)\.$/.test(prefix)) {
        continue;
      }
      lastBoundary = i + 1;
    }
  }

  if (lastBoundary === -1) return null;
  const head = paragraph.slice(0, lastBoundary).trim();
  const tail = paragraph.slice(lastBoundary).trim();
  if (!head || !tail) return null;
  return { head, tail };
}

export function splitGuidingQuestion(markdown: string): SplitAssistantResponse {
  const normalized = markdown.replace(/\r\n/g, '\n').trim();
  if (!normalized || !looksLikeQuestion(normalized)) {
    return { body: markdown, guidingQuestion: null };
  }

  const blocks = normalized.split(/\n{2,}/);
  const lastBlock = blocks[blocks.length - 1]?.trim() ?? '';

  if (isNonProseBlock(lastBlock) || !looksLikeQuestion(lastBlock)) {
    return { body: markdown, guidingQuestion: null };
  }

  // Case 1: Standalone trailing question paragraph
  if (blocks.length >= 2) {
    const body = blocks.slice(0, -1).join('\n\n').trim();
    if (
      body.length >= MIN_BODY_LEN &&
      lastBlock.length >= MIN_QUESTION_LEN &&
      lastBlock.length <= MAX_QUESTION_LEN
    ) {
      return { body, guidingQuestion: lastBlock };
    }
  }

  // Case 2: Trailing Socratic question sentence inside the final paragraph
  const split = splitLastSentence(lastBlock);
  if (!split) {
    return { body: markdown, guidingQuestion: null };
  }

  const precedingBlocks = blocks.slice(0, -1);
  const body = [...precedingBlocks, split.head].join('\n\n').trim();
  if (
    body.length >= MIN_BODY_LEN &&
    looksLikeQuestion(split.tail) &&
    split.tail.length >= MIN_QUESTION_LEN &&
    split.tail.length <= MAX_QUESTION_LEN
  ) {
    return { body, guidingQuestion: split.tail };
  }

  return { body: markdown, guidingQuestion: null };
}
