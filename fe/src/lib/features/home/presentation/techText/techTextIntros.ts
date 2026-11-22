import {
  clamp01,
  noise,
  smoothstep,
  type Cell,
  type Glyph,
  type TechTextSettings,
  type Word,
} from '../../domain/techText';

const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export function blitArt(
  target: CanvasRenderingContext2D,
  art: { image: HTMLCanvasElement; left: number; top: number },
  dx: number,
  dy: number,
  originX: number,
  originY: number,
  dpr: number,
): void {
  target.drawImage(
    art.image,
    Math.round((art.left + dx) * dpr - originX),
    Math.round((art.top + dy) * dpr - originY),
  );
}

export function crispCoord(value: number, dpr: number): number {
  return (Math.round(value * dpr) + 0.5) / dpr;
}

function cellRect(
  x: number,
  y: number,
  size: number,
  dpr: number,
): [number, number, number, number] {
  const left = Math.round(x * dpr);
  const top = Math.round(y * dpr);
  return [left, top, Math.round((x + size) * dpr) - left, Math.round((y + size) * dpr) - top];
}

export function ensureCells(glyph: Glyph, view: Word, dpr: number): Cell[] {
  if (glyph.cells) return glyph.cells;
  const art = glyph.fill;
  const size = Math.max(3, Math.round(view.size / 26));
  const w = art.image.width;
  const h = art.image.height;
  const source = art.image.getContext('2d');
  const cells: Cell[] = [];
  glyph.cells = cells;
  glyph.assembled = 0;
  if (!source || w < 2 || h < 2) return cells;

  const data = source.getImageData(0, 0, w, h).data;
  const gx = Math.floor(art.left / size) * size;
  const gy = Math.floor(art.top / size) * size;
  const cols = Math.ceil((art.left + w / dpr - gx) / size) + 1;
  const rows = Math.ceil((art.top + h / dpr - gy) / size) + 1;
  const hit = new Uint8Array(cols * rows);

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      if (data[(py * w + px) * 4 + 3] < 24) continue;
      const cx = Math.floor((art.left + px / dpr - gx) / size);
      const cy = Math.floor((art.top + py / dpr - gy) / size);
      hit[cy * cols + cx] = 1;
    }
  }

  const center = (glyph.box.x1 + glyph.box.x2) / 2;
  const along = clamp01((center - view.left) / Math.max(1, view.right - view.left));
  for (let k = 0; k < hit.length; k++) {
    if (!hit[k]) continue;
    const angle = noise(glyph.index, k, 1) * Math.PI * 2;
    const distance = view.size * (0.25 + 0.6 * noise(glyph.index, k, 2));
    const start = 0.03 + 0.36 * along + 0.12 * noise(glyph.index, k, 3);
    const land = start + 0.3 + 0.14 * noise(glyph.index, k, 4);
    cells.push({
      x: gx + (k % cols) * size,
      y: gy + Math.floor(k / cols) * size,
      size,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.7,
      start,
      land,
    });
    glyph.assembled = Math.max(glyph.assembled, land);
  }
  return cells;
}

export function drawAssembling(
  ctx: CanvasRenderingContext2D,
  glyph: Glyph,
  progress: number,
  accent: string,
  dpr: number,
): void {
  const cells = glyph.cells || [];
  ctx.save();
  ctx.beginPath();
  let landed = 0;
  for (const cell of cells) {
    if (progress < cell.land) continue;
    const [x, y, w, h] = cellRect(cell.x, cell.y, cell.size, dpr);
    ctx.rect(x, y, w, h);
    landed++;
  }
  if (landed) {
    ctx.clip();
    blitArt(ctx, glyph.fill, 0, 0, 0, 0, dpr);
  }
  ctx.restore();

  ctx.fillStyle = accent;
  for (const cell of cells) {
    if (progress < cell.start || progress >= cell.land) continue;
    const u = (progress - cell.start) / (cell.land - cell.start);
    const eased = 1 - Math.pow(1 - u, 4);
    const size = cell.size * (0.4 + 0.6 * eased);
    const x = cell.x + (cell.size - size) / 2 + cell.dx * (1 - eased);
    const y = cell.y + (cell.size - size) / 2 + cell.dy * (1 - eased);
    const [left, top, w, h] = cellRect(x, y, size, dpr);
    ctx.globalAlpha = Math.min(1, u * 4) * (0.55 + 0.45 * eased);
    ctx.fillRect(left, top, Math.max(1, w), Math.max(1, h));
  }
  ctx.globalAlpha = 1;
}

export function drawFilling(
  ctx: CanvasRenderingContext2D,
  glyph: Glyph,
  lead: number,
  progress: number,
  view: Word,
  dpr: number,
): void {
  const art = glyph.fill;
  const left = Math.floor(art.left * dpr);
  const w = art.image.width + 2;
  const h = art.image.height + 2;
  const fill = clamp01((progress - 0.24 - 0.28 * lead) / 0.48);
  const rects: [number, number][] = [];

  for (const band of view.bands) {
    const amount = smoothstep(0.3 * band.order, 0.3 * band.order + 0.4, fill);
    if (amount <= 0) continue;
    const span = (band.y1 - band.y0) * amount;
    const y0 = Math.round((band.up ? band.y1 - span : band.y0) * dpr);
    const y1 = Math.round((band.up ? band.y1 : band.y0 + span) * dpr);
    if (y1 > y0) rects.push([y0, y1 - y0]);
  }

  const outline = smoothstep(0.08 + 0.2 * lead, 0.22 + 0.2 * lead, progress);
  if (outline > 0.001) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(left - 2, Math.floor(art.top * dpr) - 2, w + 2, h + 2);
    for (const [y, span] of rects) ctx.rect(left - 2, y, w + 2, span);
    ctx.clip('evenodd');
    ctx.globalAlpha = outline;
    blitArt(ctx, glyph.dashes, 0, 0, 0, 0, dpr);
    ctx.restore();
  }
  if (rects.length) {
    ctx.save();
    ctx.beginPath();
    for (const [y, span] of rects) ctx.rect(left - 2, y, w + 2, span);
    ctx.clip();
    blitArt(ctx, glyph.fill, 0, 0, 0, 0, dpr);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

export function drawGuideLines(
  ctx: CanvasRenderingContext2D,
  s: TechTextSettings,
  view: Word,
  width: number,
  dpr: number,
  accent: string,
  alpha: number,
  growth: (k: number) => number,
): void {
  const pad = Math.max(12, view.size * 0.12);
  const x1 = Math.round(view.left - pad);
  const x2 = Math.round(view.right + pad);
  const room = width - x2 > x1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 1;
  ctx.font = LABEL_FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = room ? 'left' : 'right';

  view.lines.forEach((line, k) => {
    const grow = growth(k);
    if (grow <= 0.001) return;
    const y = crispCoord(line.y, dpr);
    const end = x1 + (x2 - x1) * grow;
    ctx.globalAlpha = alpha * 0.4;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(end, y);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillRect(x1 - 1, Math.round(line.y) - 1, 3, 3);
    ctx.fillRect(Math.round(end) - 1, Math.round(line.y) - 1, 3, 3);
    if (s.labels) {
      ctx.globalAlpha = alpha * 0.62 * smoothstep(0.7, 1, grow);
      ctx.fillText(line.label, room ? x2 + 8 : x1 - 8, Math.round(line.y));
    }
  });

  ctx.textAlign = 'left';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
}
