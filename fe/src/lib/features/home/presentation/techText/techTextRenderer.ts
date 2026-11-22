import type { Art, Glyph, Shape, TechTextSettings, Word } from '../../domain/techText';
import { blitArt } from './techTextIntros';

const FALLOFF_STEPS = 8;
const INHERIT = /^(currentcolor|inherit)$/i;
const CSS_VAR_RE = /^var\(\s*(--[a-zA-Z0-9_-]+)(?:\s*,\s*([^)]+))?\s*\)$/;

export function resolveFontFamily(container: HTMLElement, s: TechTextSettings): string {
  return s.fontFamily || getComputedStyle(container).fontFamily || 'sans-serif';
}

export function formatCanvasFont(
  container: HTMLElement,
  s: TechTextSettings,
  size: number,
): string {
  return `${s.fontWeight} ${size}px ${resolveFontFamily(container, s)}`;
}

function resolveColorToken(
  computed: CSSStyleDeclaration,
  raw: string,
  fallback: string,
): string {
  const trimmed = String(raw || '').trim();
  if (!trimmed || INHERIT.test(trimmed)) return fallback;
  const varMatch = trimmed.match(CSS_VAR_RE);
  if (varMatch) {
    const resolved = computed.getPropertyValue(varMatch[1]).trim();
    if (resolved) return resolved;
    if (varMatch[2]) return varMatch[2].trim();
    return fallback;
  }
  return trimmed;
}

export function resolvePalette(
  container: HTMLElement,
  s: TechTextSettings,
): { ink: string; accent: string; shadow: string } {
  const computed = getComputedStyle(container);
  const current = computed.color || '#000000';
  const ink = resolveColorToken(computed, s.color, current);
  const accent = resolveColorToken(computed, s.accentColor, current);
  const shadow =
    s.shadowColor && s.shadowOffset !== 0
      ? resolveColorToken(computed, s.shadowColor, '')
      : '';
  return { ink, accent, shadow };
}

export function applyFontToContext(
  target: CanvasRenderingContext2D,
  container: HTMLElement,
  s: TechTextSettings,
  size: number,
): void {
  target.font = formatCanvasFont(container, s, size);
  if ('letterSpacing' in target) target.letterSpacing = `${s.letterSpacing * size}px`;
  target.textAlign = 'left';
  target.textBaseline = 'alphabetic';
}

export function createGlyphSprite(
  container: HTMLElement,
  s: TechTextSettings,
  view: Word,
  glyph: Shape,
  stroke: boolean,
  ink: string,
  dpr: number,
): Art {
  const pad = Math.ceil(s.strokeWidth * 2 + 4);
  const left = glyph.box.x1 - pad;
  const top = glyph.box.y1 - pad;
  const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
  const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
  const image = document.createElement('canvas');
  image.width = Math.max(1, Math.ceil(w * dpr));
  image.height = Math.max(1, Math.ceil(h * dpr));
  const c = image.getContext('2d');
  if (!c) return { image, left, top };

  c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
  applyFontToContext(c, container, s, view.size);
  if (stroke) {
    c.lineJoin = 'round';
    c.lineWidth = s.strokeWidth * 2;
    c.lineCap = 'butt';
    c.strokeStyle = ink;
    if (s.lineStyle !== 'solid') {
      c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
    }
    c.strokeText(glyph.char, glyph.x, view.baseline);
    c.setLineDash([]);
    c.globalCompositeOperation = 'destination-out';
    c.fillStyle = '#000000';
    c.fillText(glyph.char, glyph.x, view.baseline);
    c.globalCompositeOperation = 'source-over';
  } else {
    c.fillStyle = ink;
    c.fillText(glyph.char, glyph.x, view.baseline);
  }
  return { image, left, top };
}

export function computeWordMetrics(
  probe: CanvasRenderingContext2D,
  container: HTMLElement,
  s: TechTextSettings,
  width: number,
  height: number,
): { word: Word; shapes: Shape[] } {
  applyFontToContext(probe, container, s, s.fontSize);
  let m = probe.measureText(s.text);
  const fit = Math.min(
    1,
    (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
    (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1),
  );
  const size = s.fontSize * fit;
  applyFontToContext(probe, container, s, size);
  m = probe.measureText(s.text);

  const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const margin = width * 0.05;
  const start =
    s.align === 'left'
      ? margin
      : s.align === 'right'
        ? width - margin - inkWidth
        : (width - inkWidth) / 2;
  const x = start + m.actualBoundingBoxLeft;
  const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
  const xHeight = baseline - probe.measureText('x').actualBoundingBoxAscent;
  const capHeight = baseline - probe.measureText('H').actualBoundingBoxAscent;
  const ascender = baseline - probe.measureText('d').actualBoundingBoxAscent;
  const descender = baseline + probe.measureText('p').actualBoundingBoxDescent;
  const top = baseline - m.actualBoundingBoxAscent;
  const bottom = baseline + m.actualBoundingBoxDescent;
  const inkTop = Math.min(top, capHeight) - 2;
  const inkBottom = Math.max(bottom, baseline) + 2;

  const word: Word = {
    size,
    baseline,
    left: x - m.actualBoundingBoxLeft,
    right: x + m.actualBoundingBoxRight,
    top,
    bottom,
    lines: [
      { y: baseline, label: 'baseline' },
      { y: xHeight, label: 'x-height' },
      { y: capHeight, label: 'cap height' },
      ...(capHeight - ascender > Math.max(11, size * 0.06)
        ? [{ y: ascender, label: 'ascender' }]
        : []),
      { y: descender, label: 'descender' },
    ],
    bands: [
      { y0: xHeight, y1: baseline, up: true, order: 0 },
      { y0: capHeight, y1: xHeight, up: true, order: 1 },
      { y0: inkTop, y1: capHeight, up: true, order: 2 },
      { y0: baseline, y1: inkBottom, up: false, order: 1 },
    ].filter((band) => band.y1 - band.y0 > 0.5),
  };

  const shapes: Shape[] = [];
  let prefix = '';
  for (const char of Array.from(s.text)) {
    prefix += char;
    const own = probe.measureText(char);
    const gx = x + probe.measureText(prefix).width - own.width;
    if (!char.trim()) continue;
    shapes.push({
      char,
      x: gx,
      box: {
        x1: gx - own.actualBoundingBoxLeft,
        y1: baseline - own.actualBoundingBoxAscent,
        x2: gx + own.actualBoundingBoxRight,
        y2: baseline + own.actualBoundingBoxDescent,
      },
    });
  }

  return { word, shapes };
}

function buildFalloff(
  target: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  strength: number,
  softness: number,
): CanvasGradient {
  const inner = Math.min(1, Math.max(0, 1 - softness));
  const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
  if (inner > 0.995) {
    gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    return gradient;
  }
  for (let i = 0; i <= FALLOFF_STEPS; i++) {
    const t = i / FALLOFF_STEPS;
    const eased = t * t * (3 - 2 * t);
    gradient.addColorStop(
      inner + (1 - inner) * t,
      `rgba(0, 0, 0, ${strength * (1 - eased)})`,
    );
  }
  return gradient;
}

export function drawAreaReveal(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scratch: HTMLCanvasElement,
  scratchCtx: CanvasRenderingContext2D,
  glyphs: Glyph[],
  s: TechTextSettings,
  lens: { x: number; y: number },
  presence: number,
  dpr: number,
): void {
  const radius = s.reach * dpr;
  const cx = lens.x * dpr;
  const cy = lens.y * dpr;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = buildFalloff(ctx, cx, cy, radius, presence, s.softness);
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.globalCompositeOperation = 'source-over';

  const x0 = Math.max(0, Math.floor(cx - radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
  const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
  if (x1 <= x0 || y1 <= y0) return;

  const w = x1 - x0;
  const h = y1 - y0;
  if (scratch.width < w || scratch.height < h) {
    scratch.width = Math.max(scratch.width, w);
    scratch.height = Math.max(scratch.height, h);
  }
  scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
  scratchCtx.globalCompositeOperation = 'source-over';
  scratchCtx.clearRect(0, 0, w, h);
  for (const glyph of glyphs) {
    blitArt(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0, dpr);
  }
  scratchCtx.globalCompositeOperation = 'destination-in';
  scratchCtx.fillStyle = buildFalloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness);
  scratchCtx.fillRect(0, 0, w, h);
  scratchCtx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = presence;
  ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
  ctx.globalAlpha = 1;
}
