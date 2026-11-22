import {
  approach,
  clamp01,
  hitTestGlyph,
  smoothstep,
  stepGlyphPhysics,
  stepSelectionFrame,
  type Kick,
  type SelectionFrame,
  type TechTextSettings,
} from '../../domain/techText';
import { attachTechTextEvents, type TechTextInputState } from './techTextEvents';
import { syncWordGlyphs, triggerClickKick, type LayoutState } from './techTextLayout';
import { paintCanvasFrame } from './techTextPaint';
import { resolvePalette } from './techTextRenderer';

const SPRING = 320;
const INTRO_DELAY = 0.15;

export interface TechTextEngine {
  updateSettings: (next: TechTextSettings) => void;
  destroy: () => void;
}

export function createTechTextEngine(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  initialSettings: TechTextSettings,
): TechTextEngine {
  const ctx = canvas.getContext('2d');
  const scratch = document.createElement('canvas');
  const scratchCtx = scratch.getContext('2d');
  if (!ctx || !scratchCtx) {
    return { updateSettings: () => {}, destroy: () => {} };
  }

  let settings = initialSettings;
  const reducedMotion = Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
  );
  let width = 1;
  let height = 1;
  let dpr = 1;
  let raf = 0;
  let last = performance.now();
  let visible = true;
  let alive = true;
  let sizeDirty = true;
  let presence = 0;
  let clock = 0;
  let pulse = 0;
  let placed = false;
  let cursor = '';
  let introClock = 0;
  let introKind = '';
  let introducing = false;
  let fontsReady = !document.fonts;
  let guideAlpha = 0;

  const layoutState: LayoutState = {
    layoutKey: '',
    requestedFont: '',
    word: null,
    glyphs: [],
  };
  const input: TechTextInputState = {
    pointer: { x: 0, y: 0, inside: false },
    grab: { x: 0, y: 0 },
    press: { x: 0, y: 0, time: 0, index: -1 },
    dragging: -1,
  };
  const kicks: Kick[] = [];
  const lens = { x: 0, y: 0 };
  const frame: SelectionFrame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

  const wake = () => {
    if (raf || !visible || !alive) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const refreshFonts = () => {
    layoutState.layoutKey = '';
    wake();
  };

  const tick = (now: number) => {
    raf = 0;
    const s = settings;
    if (sizeDirty) {
      sizeDirty = false;
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    }

    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const { ink, accent, shadow } = resolvePalette(container, s);
    const synced = syncWordGlyphs(
      layoutState,
      container,
      scratchCtx,
      s,
      ink,
      shadow,
      width,
      height,
      dpr,
      input.dragging,
      frame,
      refreshFonts,
    );
    const view = synced.word;
    input.dragging = synced.dragging;
    const glyphs = layoutState.glyphs;
    const damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(s.bounce) * 0.96);

    if (s.intro !== introKind) {
      introKind = s.intro;
      introClock = 0;
    }
    const introOn = introKind !== 'none' && !reducedMotion && glyphs.length > 0;
    if (introOn && fontsReady) introClock += dt;
    const progress = introOn
      ? clamp01((introClock - INTRO_DELAY) / Math.max(0.3, s.introDuration))
      : 1;
    introducing = introOn && progress < 1;

    const sweeping =
      !introducing && s.sweep && !reducedMotion && !input.pointer.inside && input.dragging < 0;
    if (sweeping) clock += dt * s.speed;
    pulse += dt;

    let targetX = input.pointer.x;
    let targetY = input.pointer.y;
    if (sweeping) {
      targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
      targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
    }
    const active = !introducing && (input.pointer.inside || sweeping || input.dragging >= 0);
    if (active && !placed) {
      lens.x = targetX;
      lens.y = targetY;
    }
    if (active) {
      const lag = input.pointer.inside ? 0.05 : 0.22;
      lens.x = approach(lens.x, targetX, dt, lag);
      lens.y = approach(lens.y, targetY, dt, lag);
    }
    placed = active;
    presence = approach(
      presence,
      s.reveal === 'area' && active && input.dragging < 0 ? 1 : 0,
      dt,
      0.16,
    );

    let moving = stepGlyphPhysics(
      glyphs,
      kicks,
      pulse,
      dt,
      damping,
      input.dragging,
      input.pointer,
      input.grab,
    );

    let typing = -1;
    if (introducing && introKind === 'type') {
      const step = 0.86 / glyphs.length;
      const cursorAt = Math.min(glyphs.length - 1, Math.floor(progress / step));
      typing = progress < 0.93 ? cursorAt : -1;
      glyphs.forEach((glyph, i) => {
        glyph.shown =
          i < cursorAt
            ? 1
            : i === cursorAt
              ? smoothstep(0, step * 0.3, progress - i * step)
              : 0;
      });
    } else {
      glyphs.forEach((glyph) => {
        glyph.shown = 1;
      });
    }

    const focus = introducing
      ? typing
      : input.dragging >= 0
        ? input.dragging
        : active
          ? hitTestGlyph(glyphs, view, lens.x, lens.y)
          : -1;
    stepSelectionFrame(frame, glyphs, focus, input.dragging, s, dt);

    glyphs.forEach((glyph, i) => {
      const target = introducing
        ? introKind === 'type' && (i === typing || (typing >= 0 && i > typing))
          ? 1
          : 0
        : s.reveal === 'letter' && i === focus && i !== input.dragging
          ? 1
          : 0;
      if (introducing && glyph.shown === 0) glyph.outline = target;
      glyph.outline = approach(glyph.outline, target, dt, 0.09);
      if (Math.abs(glyph.outline - target) > 0.002) moving = true;
      else glyph.outline = target;
    });

    guideAlpha = approach(
      guideAlpha,
      s.guides && !introducing && (focus >= 0 || presence > 0.4) ? 1 : 0,
      dt,
      0.14,
    );

    const hovering = !introducing && focus >= 0 && input.pointer.inside;
    const nextCursor =
      input.dragging >= 0
        ? 'grabbing'
        : hovering && s.draggable
          ? 'grab'
          : hovering && s.clickKick
            ? 'pointer'
            : '';
    if (nextCursor !== cursor) {
      cursor = nextCursor;
      container.style.cursor = nextCursor;
    }

    paintCanvasFrame({
      ctx,
      canvas,
      scratch,
      scratchCtx,
      s,
      view,
      glyphs,
      frame,
      lens,
      width,
      dpr,
      accent,
      pulse,
      presence,
      guideAlpha,
      introducing,
      introKind,
      progress,
    });

    const settling =
      moving ||
      introducing ||
      kicks.length > 0 ||
      (guideAlpha > 0.005 && guideAlpha < 0.995) ||
      Math.abs(presence - (s.reveal === 'area' && active && input.dragging < 0 ? 1 : 0)) >
        0.002 ||
      (frame.alpha > 0.01 && frame.alpha < 0.99);
    if ((active || settling) && visible && alive) {
      raf = requestAnimationFrame(tick);
    }
  };

  const detachEvents = attachTechTextEvents({
    container,
    layoutState,
    input,
    reducedMotion,
    getSettings: () => settings,
    isIntroducing: () => introducing,
    onResize: () => {
      sizeDirty = true;
      wake();
    },
    onVisibility: (isVisible) => {
      visible = isVisible;
      wake();
    },
    onFontsReady: () => {
      fontsReady = true;
      refreshFonts();
    },
    onWake: wake,
    onClickKick: (index) => {
      triggerClickKick(kicks, layoutState.glyphs.length, layoutState.word, index, pulse);
      wake();
    },
  });

  sizeDirty = true;
  wake();

  return {
    updateSettings(next) {
      settings = next;
      wake();
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      detachEvents();
    },
  };
}
