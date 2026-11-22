import { hitTestGlyph, type TechTextSettings } from '../../domain/techText';
import type { LayoutState } from './techTextLayout';

export interface TechTextInputState {
  pointer: { x: number; y: number; inside: boolean };
  grab: { x: number; y: number };
  press: { x: number; y: number; time: number; index: number };
  dragging: number;
}

export interface TechTextEventDeps {
  container: HTMLElement;
  layoutState: LayoutState;
  input: TechTextInputState;
  reducedMotion: boolean;
  getSettings: () => TechTextSettings;
  isIntroducing: () => boolean;
  onResize: () => void;
  onVisibility: (visible: boolean) => void;
  onFontsReady: () => void;
  onWake: () => void;
  onClickKick: (index: number) => void;
}

export function attachTechTextEvents(deps: TechTextEventDeps): () => void {
  const { container, layoutState, input } = deps;

  const locate = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    input.pointer.x = e.clientX - rect.left;
    input.pointer.y = e.clientY - rect.top;
  };

  const onMove = (e: PointerEvent) => {
    locate(e);
    input.pointer.inside = true;
    deps.onWake();
  };

  const onLeave = () => {
    if (input.dragging >= 0) return;
    input.pointer.inside = false;
    deps.onWake();
  };

  const onDown = (e: PointerEvent) => {
    locate(e);
    input.pointer.inside = true;
    const primary = e.pointerType !== 'mouse' || e.button === 0;
    const index =
      deps.isIntroducing() || !primary
        ? -1
        : hitTestGlyph(layoutState.glyphs, layoutState.word, input.pointer.x, input.pointer.y);
    input.press.x = input.pointer.x;
    input.press.y = input.pointer.y;
    input.press.time = performance.now();
    input.press.index = index;
    if (deps.getSettings().draggable && index >= 0) {
      input.dragging = index;
      input.grab.x = input.pointer.x - layoutState.glyphs[index].offset.x;
      input.grab.y = input.pointer.y - layoutState.glyphs[index].offset.y;
      container.setPointerCapture?.(e.pointerId);
    }
    deps.onWake();
  };

  const onUp = (e: PointerEvent) => {
    if (input.dragging >= 0) {
      input.dragging = -1;
      container.releasePointerCapture?.(e.pointerId);
      const rect = container.getBoundingClientRect();
      input.pointer.inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    }
    if (
      e.type === 'pointerup' &&
      input.press.index >= 0 &&
      deps.getSettings().clickKick &&
      !deps.reducedMotion &&
      performance.now() - input.press.time < 450
    ) {
      const rect = container.getBoundingClientRect();
      if (
        Math.hypot(e.clientX - rect.left - input.press.x, e.clientY - rect.top - input.press.y) < 6
      ) {
        deps.onClickKick(input.press.index);
      }
    }
    input.press.index = -1;
    deps.onWake();
  };

  container.addEventListener('pointermove', onMove, { passive: true });
  container.addEventListener('pointerenter', onMove, { passive: true });
  container.addEventListener('pointerdown', onDown, { passive: true });
  container.addEventListener('pointerup', onUp, { passive: true });
  container.addEventListener('pointercancel', onUp, { passive: true });
  container.addEventListener('pointerleave', onLeave, { passive: true });

  const resizeObserver = new ResizeObserver(deps.onResize);
  resizeObserver.observe(container);
  window.addEventListener('resize', deps.onResize, { passive: true });

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    deps.onVisibility(entry.isIntersecting);
  });
  intersectionObserver.observe(container);

  const themeObserver = new MutationObserver(deps.onWake);
  for (const node of [document.documentElement, document.body]) {
    if (node) {
      themeObserver.observe(node, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-theme'],
      });
    }
  }

  const schemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
  schemeQuery?.addEventListener?.('change', deps.onWake);
  if (document.fonts) document.fonts.ready.then(deps.onFontsReady, deps.onFontsReady);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', deps.onResize);
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    schemeQuery?.removeEventListener?.('change', deps.onWake);
    container.style.cursor = '';
    container.removeEventListener('pointermove', onMove);
    container.removeEventListener('pointerenter', onMove);
    container.removeEventListener('pointerdown', onDown);
    container.removeEventListener('pointerup', onUp);
    container.removeEventListener('pointercancel', onUp);
    container.removeEventListener('pointerleave', onLeave);
  };
}
