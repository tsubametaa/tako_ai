import type {
  Glyph,
  Kick,
  SelectionFrame,
  TechTextSettings,
  Word,
} from '../../domain/techText';
import {
  computeWordMetrics,
  createGlyphSprite,
  formatCanvasFont,
  resolveFontFamily,
} from './techTextRenderer';

const KICK_DECAY = 0.62;

export interface LayoutState {
  layoutKey: string;
  requestedFont: string;
  word: Word | null;
  glyphs: Glyph[];
}

export function syncWordGlyphs(
  state: LayoutState,
  container: HTMLElement,
  scratchCtx: CanvasRenderingContext2D,
  s: TechTextSettings,
  ink: string,
  shadow: string,
  width: number,
  height: number,
  dpr: number,
  dragging: number,
  frame: SelectionFrame,
  onFontLoad: () => void,
): { word: Word; dragging: number } {
  const key = [
    s.text,
    resolveFontFamily(container, s),
    s.fontWeight,
    s.fontSize,
    s.letterSpacing,
    s.align,
    ink,
    shadow,
    s.shadowOffset,
    s.dashLength,
    s.dashGap,
    s.strokeWidth,
    s.lineStyle,
    width,
    height,
    dpr,
  ].join('|');

  if (key === state.layoutKey && state.word) {
    return { word: state.word, dragging };
  }
  state.layoutKey = key;

  const wanted = formatCanvasFont(container, s, 64);
  if (document.fonts && wanted !== state.requestedFont) {
    state.requestedFont = wanted;
    document.fonts.load(wanted, s.text).then(onFontLoad, onFontLoad);
  }

  const { word: next, shapes } = computeWordMetrics(
    scratchCtx,
    container,
    s,
    width,
    height,
  );
  state.word = next;

  const previous = state.glyphs;
  const nextGlyphs: Glyph[] = [];
  let charIndex = 0;

  for (const char of Array.from(s.text)) {
    if (!char.trim()) {
      charIndex++;
      continue;
    }
    const base = shapes[nextGlyphs.length];
    if (!base) {
      charIndex++;
      continue;
    }
    const kept = previous[nextGlyphs.length];
    const sameGlyph = kept?.char === base.char && kept.index === charIndex;
    nextGlyphs.push({
      ...base,
      offset: sameGlyph ? kept.offset : { x: 0, y: 0 },
      velocity: sameGlyph ? kept.velocity : { x: 0, y: 0 },
      outline: sameGlyph ? kept.outline : 0,
      shown: sameGlyph ? kept.shown : 1,
      cells: null,
      assembled: 0,
      index: charIndex,
      fill: createGlyphSprite(container, s, next, base, false, ink, dpr),
      dashes: createGlyphSprite(container, s, next, base, true, ink, dpr),
      shadow: shadow
        ? createGlyphSprite(container, s, next, base, false, shadow, dpr)
        : null,
    });
    charIndex++;
  }

  state.glyphs = nextGlyphs;
  const nextDragging =
    dragging >= 0 && nextGlyphs[dragging]?.index !== previous[dragging]?.index
      ? -1
      : dragging;
  if (frame.index >= 0 && nextGlyphs[frame.index]?.char !== previous[frame.index]?.char) {
    frame.index = -1;
  }
  return { word: next, dragging: nextDragging };
}

export function triggerClickKick(
  kicks: Kick[],
  glyphCount: number,
  word: Word | null,
  index: number,
  pulse: number,
): void {
  const strength = (word ? word.size : 120) * 11;
  kicks.push({ index, at: pulse, velocity: strength });
  for (let d = 1; d < glyphCount; d++) {
    const velocity = strength * Math.pow(KICK_DECAY, d);
    if (velocity < 30) break;
    for (const j of [index - d, index + d]) {
      if (j >= 0 && j < glyphCount) {
        kicks.push({ index: j, at: pulse + d * 0.055, velocity });
      }
    }
  }
}
