import {
  smoothstep,
  type Glyph,
  type SelectionFrame,
  type TechTextSettings,
  type Word,
} from '../../domain/techText';
import { drawSelectionFrame } from './techTextFrame';
import {
  blitArt,
  drawAssembling,
  drawFilling,
  drawGuideLines,
  ensureCells,
} from './techTextIntros';
import { drawAreaReveal } from './techTextRenderer';

export interface PaintFrameParams {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  scratch: HTMLCanvasElement;
  scratchCtx: CanvasRenderingContext2D;
  s: TechTextSettings;
  view: Word;
  glyphs: Glyph[];
  frame: SelectionFrame;
  lens: { x: number; y: number };
  width: number;
  dpr: number;
  accent: string;
  pulse: number;
  presence: number;
  guideAlpha: number;
  introducing: boolean;
  introKind: string;
  progress: number;
}

export function paintCanvasFrame(p: PaintFrameParams): void {
  const { ctx, canvas, scratch, scratchCtx, s, view, glyphs, frame, lens, width, dpr, accent } = p;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const glyph of glyphs) {
    const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
    if (moved > 1) {
      ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
      blitArt(ctx, glyph.dashes, 0, 0, 0, 0, dpr);
      ctx.globalAlpha = 1;
    }
  }

  if (p.introducing && p.introKind === 'metrics') {
    drawGuideLines(
      ctx,
      s,
      view,
      width,
      dpr,
      accent,
      1 - smoothstep(0.84, 1, p.progress),
      (k) => smoothstep(0.02 + 0.04 * k, 0.2 + 0.04 * k, p.progress),
    );
  } else if (p.guideAlpha > 0.005) {
    drawGuideLines(ctx, s, view, width, dpr, accent, p.guideAlpha * 0.6, () => 1);
  }

  glyphs.forEach((glyph, i) => {
    if (p.introducing && p.introKind === 'assemble') {
      ensureCells(glyph, view, dpr);
      if (p.progress < glyph.assembled) {
        drawAssembling(ctx, glyph, p.progress, accent, dpr);
        return;
      }
    }
    if (p.introducing && p.introKind === 'metrics') {
      const lead = glyphs.length > 1 ? i / (glyphs.length - 1) : 0;
      if (p.progress < 0.72 + 0.28 * lead) {
        drawFilling(ctx, glyph, lead, p.progress, view, dpr);
        return;
      }
    }
    if (glyph.shown < 0.001) return;
    if (glyph.outline < 0.999) {
      ctx.globalAlpha = (1 - glyph.outline) * glyph.shown;
      if (glyph.shadow && s.shadowOffset !== 0) {
        const scale = view.size / Math.max(1, s.fontSize);
        const sign = s.shadowOffset < 0 ? -1 : 1;
        const scaledOffset =
          sign * Math.max(2, Math.round(Math.abs(s.shadowOffset) * scale));
        blitArt(
          ctx,
          glyph.shadow,
          glyph.offset.x + scaledOffset,
          glyph.offset.y + scaledOffset,
          0,
          0,
          dpr,
        );
      }
      blitArt(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0, dpr);
    }
    if (glyph.outline > 0.001) {
      ctx.globalAlpha = glyph.outline * glyph.shown;
      blitArt(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0, dpr);
    }
    ctx.globalAlpha = 1;
  });

  if (p.presence > 0.001) {
    drawAreaReveal(ctx, canvas, scratch, scratchCtx, glyphs, s, lens, p.presence, dpr);
  }
  drawSelectionFrame(ctx, glyphs, frame, s, p.pulse, accent, dpr);
}
