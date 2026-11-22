export interface RevealOptions {
  delay?: number;
  duration?: number;
  y?: number;
  threshold?: number;
}

export interface MagneticOptions {
  strength?: number;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  const { delay = 0, duration = 480, y = 20, threshold = 0.12 } = options;

  if (typeof window === 'undefined' || prefersReducedMotion() || !('IntersectionObserver' in window)) {
    return { destroy() {} };
  }

  node.style.opacity = '0';
  node.style.transform = `translate3d(0, ${y}px, 0)`;
  node.style.willChange = 'opacity, transform';

  const revealNow = () => {
    node.style.transition = `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;
    node.style.opacity = '1';
    node.style.transform = 'translate3d(0, 0, 0)';
    window.setTimeout(() => {
      node.style.willChange = 'auto';
      node.style.transition = '';
    }, duration + delay + 60);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          revealNow();
          observer.unobserve(node);
          break;
        }
      }
    },
    { threshold, rootMargin: '0px 0px -32px 0px' },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

export function magnetic(node: HTMLElement, options: MagneticOptions = {}) {
  const strength = options.strength ?? 5;

  if (
    typeof window === 'undefined' ||
    prefersReducedMotion() ||
    !window.matchMedia('(pointer: fine)').matches
  ) {
    return { destroy() {} };
  }

  function handlePointerMove(e: PointerEvent) {
    const rect = node.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const dx = Math.max(-strength, Math.min(strength, relX * strength * 2));
    const dy = Math.max(-strength, Math.min(strength, relY * strength * 2));
    node.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  }

  function handlePointerLeave() {
    node.style.transform = '';
  }

  node.addEventListener('pointermove', handlePointerMove);
  node.addEventListener('pointerleave', handlePointerLeave);

  return {
    destroy() {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
    },
  };
}
