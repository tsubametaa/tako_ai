import {
  noise,
  signed,
  type Glyph,
  type SelectionFrame,
  type TechTextSettings,
} from '../../domain/techText';
import { crispCoord } from './techTextIntros';

const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

function perimeterPoint(
  frame: SelectionFrame,
  distance: number,
  w: number,
  h: number,
): [number, number, number, number] {
  let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
  if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
  d -= w;
  if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
  d -= h;
  if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
  d -= w;
  return [frame.x1, frame.y2 - d, -1, 0];
}

function drawSpecks(
  ctx: CanvasRenderingContext2D,
  frame: SelectionFrame,
  s: TechTextSettings,
  pulse: number,
  a: number,
  accent: string,
): void {
  const w = frame.x2 - frame.x1;
  const h = frame.y2 - frame.y1;
  if (w < 2 || h < 2) return;
  const perimeter = 2 * (w + h);
  const seed = frame.index + 1;
  const grid = 3;
  ctx.fillStyle = accent;
  ctx.strokeStyle = accent;

  for (let k = 0; k < s.specks; k++) {
    const period = 0.5 + noise(seed, k, 11) * 1.2;
    const t = pulse / period + noise(seed, k, 17);
    const cycle = Math.floor(t);
    const life = t - cycle;
    if (life > 0.7) continue;
    const [px, py, nx, ny] = perimeterPoint(frame, noise(seed, k, cycle) * perimeter, w, h);
    const pick = noise(seed, k, cycle, 2);
    const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
    const large = size >= 8;
    const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
    const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
    const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
    const tone = noise(seed, k, cycle, 3);
    const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
    const left = Math.round(x - size / 2);
    const top = Math.round(y - size / 2);

    ctx.globalAlpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
    if (tone < 0.26 || (large && tone < 0.78)) {
      ctx.strokeRect(left + 0.5, top + 0.5, size, size);
      if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
    } else {
      ctx.fillRect(left, top, size, size);
    }
  }

  for (let j = 0; j < 2; j++) {
    const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
    for (let i = 0; i < 4; i++) {
      const [x, y] = perimeterPoint(frame, head - i * 6, w, h);
      const size = i === 0 ? 3 : 2;
      ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
      ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
    }
  }
  ctx.globalAlpha = 1;
}

export function drawSelectionFrame(
  ctx: CanvasRenderingContext2D,
  glyphs: Glyph[],
  frame: SelectionFrame,
  s: TechTextSettings,
  pulse: number,
  accent: string,
  dpr: number,
): void {
  const glyph = glyphs[frame.index];
  if (!glyph || frame.alpha < 0.01) return;
  const a = frame.alpha;
  const x1 = crispCoord(frame.x1, dpr);
  const y1 = crispCoord(frame.y1, dpr);
  const x2 = crispCoord(frame.x2, dpr);
  const y2 = crispCoord(frame.y2, dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = accent;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;

  const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
  if (moved > 1) {
    const hx = (glyph.box.x1 + glyph.box.x2) / 2;
    const hy = (glyph.box.y1 + glyph.box.y2) / 2;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
    ctx.setLineDash([3, 4]);
    ctx.globalAlpha = 0.55 * a;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 5, 5);
    ctx.globalAlpha = 0.8 * a;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.rect(x1, y1, x2 - x1, y2 - y1);
  ctx.globalAlpha = 0.65 * a;
  ctx.stroke();

  ctx.beginPath();
  for (const [cx, cy] of [
    [x1, y1],
    [x2, y1],
    [x2, y2],
    [x1, y2],
  ]) {
    ctx.rect(Math.round(cx) - 3, Math.round(cy) - 3, 6, 6);
  }
  ctx.globalAlpha = 0.95 * a;
  ctx.fill();
  ctx.globalAlpha = 1;

  if (s.specks > 0) drawSpecks(ctx, frame, s, pulse, a, accent);
  if (!s.labels) return;

  ctx.font = LABEL_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.78 * a;
  const label =
    moved > 1
      ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
      : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
  ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
  ctx.globalAlpha = 1;
}
