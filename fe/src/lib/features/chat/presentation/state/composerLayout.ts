export const MAX_TEXTAREA_HEIGHT = 200;
const COLLAPSE_HYSTERESIS_RATIO = 0.72;
const MULTILINE_BUFFER_PX = 6;
const WIDTH_LIMIT_BUFFER_PX = 8;

let measureCtx: CanvasRenderingContext2D | null = null;

function getSingleLineHeight(el: HTMLTextAreaElement): number {
  const style = getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight) || 24;
  const padY =
    (parseFloat(style.paddingTop) || 0) +
    (parseFloat(style.paddingBottom) || 0);
  const minHeight = parseFloat(style.minHeight) || 0;
  return Math.max(lineHeight + padY, minHeight);
}

function getHorizontalPadding(el: HTMLTextAreaElement): number {
  const style = getComputedStyle(el);
  return (
    (parseFloat(style.paddingLeft) || 0) +
    (parseFloat(style.paddingRight) || 0)
  );
}

function measureSingleLineTextWidth(
  value: string,
  el: HTMLTextAreaElement,
): number | null {
  if (typeof document === 'undefined') return null;
  if (!measureCtx) {
    measureCtx = document.createElement('canvas').getContext('2d');
  }
  if (!measureCtx) return null;

  const style = getComputedStyle(el);
  measureCtx.font =
    style.font ||
    `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return measureCtx.measureText(value.replace(/\t/g, '    ')).width;
}

export function syncTextareaHeight(
  el: HTMLTextAreaElement | undefined,
  text: string,
  isExpanded: boolean,
): void {
  if (!el) return;

  if (text.length === 0 || !isExpanded) {
    el.style.height = '';
    el.style.overflowY = 'hidden';
    return;
  }

  el.style.height = 'auto';
  const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
  el.style.height = `${nextHeight}px`;
  el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
}

export interface EvaluateComposerLayoutParams {
  el: HTMLTextAreaElement;
  text: string;
  hasNewline: boolean;
  hasAttachments: boolean;
  isExpanded: boolean;
  isMultilineText: boolean;
  inlineTextareaWidth: number;
}

export function evaluateNextMultilineState({
  el,
  text,
  hasNewline,
  hasAttachments,
  isExpanded,
  isMultilineText,
  inlineTextareaWidth,
}: EvaluateComposerLayoutParams): boolean {
  if (text.length === 0) return false;

  const padX = getHorizontalPadding(el);
  const inlineContentWidth =
    inlineTextareaWidth > 0
      ? Math.max(80, inlineTextareaWidth - padX)
      : Math.max(120, el.clientWidth - padX - (isExpanded ? 260 : 0));

  // Level 1 -> Level 2: pindah ke atas tepat saat teks mencapai width limit slot inline
  if (!isExpanded && !hasNewline) {
    const measuredWidth = measureSingleLineTextWidth(text, el);
    if (
      measuredWidth !== null &&
      measuredWidth >= inlineContentWidth - WIDTH_LIMIT_BUFFER_PX
    ) {
      return true;
    }
  }

  el.style.height = 'auto';
  const singleLineHeight = getSingleLineHeight(el);
  const wrapsMultipleLines =
    el.scrollHeight > singleLineHeight + MULTILINE_BUFFER_PX;

  if (wrapsMultipleLines) return true;

  // Level 2+ -> Level 1: hysteresis agar tidak kedip saat menghapus di dekat width limit
  if (isMultilineText && !hasNewline && !hasAttachments) {
    const measuredWidth = measureSingleLineTextWidth(text, el);
    if (
      measuredWidth !== null &&
      measuredWidth < inlineContentWidth * COLLAPSE_HYSTERESIS_RATIO
    ) {
      return false;
    }
  }

  return isMultilineText;
}
