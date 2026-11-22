export type TechTextAlign = 'left' | 'center' | 'right';
export type TechTextReveal = 'area' | 'letter' | 'off';
export type TechTextLineStyle = 'dashed' | 'solid';
export type TechTextIntro = 'none' | 'type' | 'assemble' | 'metrics';

export interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Art {
  image: HTMLCanvasElement;
  left: number;
  top: number;
}

export interface Shape {
  char: string;
  x: number;
  box: Box;
}

export interface Cell {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  start: number;
  land: number;
}

export interface Glyph extends Shape {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  shown: number;
  cells: Cell[] | null;
  assembled: number;
  index: number;
  fill: Art;
  dashes: Art;
  shadow: Art | null;
}

export interface Line {
  y: number;
  label: string;
}

export interface Band {
  y0: number;
  y1: number;
  up: boolean;
  order: number;
}

export interface Word {
  size: number;
  baseline: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  lines: Line[];
  bands: Band[];
}

export interface Kick {
  index: number;
  at: number;
  velocity: number;
}

export interface SelectionFrame {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
  index: number;
}

const SPRING = 320;

export interface TechTextSettings {
  text: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  color: string;
  accentColor: string;
  shadowColor: string;
  shadowOffset: number;
  align: TechTextAlign;
  reach: number;
  softness: number;
  dashLength: number;
  dashGap: number;
  strokeWidth: number;
  lineStyle: TechTextLineStyle;
  reveal: TechTextReveal;
  specks: number;
  selection: boolean;
  labels: boolean;
  draggable: boolean;
  bounce: number;
  sweep: boolean;
  speed: number;
  clickKick: boolean;
  intro: TechTextIntro;
  introDuration: number;
  guides: boolean;
}

export const DEFAULT_TECH_TEXT_SETTINGS: TechTextSettings = {
  text: 'TAKO AI',
  fontFamily: '',
  fontWeight: 800,
  fontSize: 150,
  letterSpacing: -0.05,
  color: 'currentColor',
  accentColor: 'currentColor',
  shadowColor: '',
  shadowOffset: 0,
  align: 'center',
  reach: 200,
  softness: 0.7,
  dashLength: 4,
  dashGap: 2,
  strokeWidth: 1.5,
  lineStyle: 'dashed',
  reveal: 'letter',
  specks: 15,
  selection: true,
  labels: true,
  draggable: true,
  bounce: 0.4,
  sweep: true,
  speed: 1,
  clickKick: true,
  intro: 'none',
  introDuration: 2,
  guides: false,
};

export function approach(
  current: number,
  target: number,
  dt: number,
  seconds: number,
): number {
  return current + (target - current) * (1 - Math.exp(-dt / seconds));
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number(value) || 0));
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function noise(...values: number[]): number {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
}

export function signed(value: number): string {
  return value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0';
}

export function hitTestGlyph(
  glyphs: Glyph[],
  wordBounds: { top: number; bottom: number } | null,
  x: number,
  y: number,
): number {
  if (!wordBounds || y < wordBounds.top - 24 || y > wordBounds.bottom + 24) {
    return -1;
  }
  let best = -1;
  let bestDistance = Infinity;
  glyphs.forEach((glyph, i) => {
    const x1 = glyph.box.x1 + glyph.offset.x;
    const x2 = glyph.box.x2 + glyph.offset.x;
    const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return bestDistance < 28 ? best : -1;
}

export function stepGlyphPhysics(
  glyphs: Glyph[],
  kicks: Kick[],
  pulse: number,
  dt: number,
  damping: number,
  dragging: number,
  pointer: { x: number; y: number },
  grab: { x: number; y: number },
): boolean {
  for (let k = kicks.length - 1; k >= 0; k--) {
    if (kicks[k].at > pulse) continue;
    const glyph = glyphs[kicks[k].index];
    if (glyph) glyph.velocity.y -= kicks[k].velocity;
    kicks.splice(k, 1);
  }

  let moving = false;
  glyphs.forEach((glyph, i) => {
    if (i === dragging) {
      glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
      glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
      glyph.velocity.x = 0;
      glyph.velocity.y = 0;
      moving = true;
      return;
    }
    const { offset, velocity } = glyph;
    if (
      Math.abs(offset.x) < 0.05 &&
      Math.abs(offset.y) < 0.05 &&
      Math.hypot(velocity.x, velocity.y) < 0.5
    ) {
      offset.x = 0;
      offset.y = 0;
      velocity.x = 0;
      velocity.y = 0;
      return;
    }
    velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
    velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
    offset.x += velocity.x * dt;
    offset.y += velocity.y * dt;
    moving = true;
  });

  return moving;
}

export function stepSelectionFrame(
  frame: SelectionFrame,
  glyphs: Glyph[],
  focus: number,
  dragging: number,
  s: TechTextSettings,
  dt: number,
): void {
  if (focus >= 0 && s.selection) {
    const glyph = glyphs[focus];
    const bx1 = glyph.box.x1 + glyph.offset.x - 6;
    const by1 = glyph.box.y1 + glyph.offset.y - 6;
    const bx2 = glyph.box.x2 + glyph.offset.x + 6;
    const by2 = glyph.box.y2 + glyph.offset.y + 6;
    if (frame.index < 0 || frame.alpha < 0.02) {
      frame.x1 = bx1;
      frame.y1 = by1;
      frame.x2 = bx2;
      frame.y2 = by2;
    }
    const glide = focus === dragging ? 0.02 : 0.08;
    frame.x1 = approach(frame.x1, bx1, dt, glide);
    frame.y1 = approach(frame.y1, by1, dt, glide);
    frame.x2 = approach(frame.x2, bx2, dt, glide);
    frame.y2 = approach(frame.y2, by2, dt, glide);
    frame.index = focus;
  }
  frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);
}
