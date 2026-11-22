import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ABOUT_CAPABILITIES,
  ABOUT_DIALOGUES,
  FOOTER_COPYRIGHT,
} from '../src/lib/features/home/domain/homeContent.ts';
import {
  approach,
  clamp01,
  DEFAULT_TECH_TEXT_SETTINGS,
  hitTestGlyph,
  noise,
  signed,
  smoothstep,
  stepGlyphPhysics,
  stepSelectionFrame,
  type Glyph,
  type Kick,
  type SelectionFrame,
} from '../src/lib/features/home/domain/techText.ts';
import { resolveTheme } from '../src/lib/features/theme/domain/theme.ts';

function createStubGlyph(x1: number, x2: number, y1 = 10, y2 = 90): Glyph {
  const stubCanvas = {} as HTMLCanvasElement;
  return {
    char: 'T',
    x: x1,
    box: { x1, y1, x2, y2 },
    offset: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    outline: 0,
    shown: 1,
    cells: null,
    assembled: 0,
    index: 0,
    fill: { image: stubCanvas, left: x1, top: y1 },
    dashes: { image: stubCanvas, left: x1, top: y1 },
    shadow: null,
  };
}

describe('home landing content and theme', () => {
  it('provides exact copyright text and non-empty dialogue/capability entries without em dashes', () => {
    assert.equal(FOOTER_COPYRIGHT, 'Copyright 2026 - By Utaaa');
    assert.equal(ABOUT_DIALOGUES.length, 3);
    assert.equal(ABOUT_CAPABILITIES.length, 3);

    for (const item of ABOUT_DIALOGUES) {
      assert.ok(!item.reply.includes('\u2014'));
      assert.ok(!item.question.includes('\u2014'));
      assert.ok(item.sourceLabel.length > 0);
    }
    for (const cap of ABOUT_CAPABILITIES) {
      assert.ok(!cap.description.includes('\u2014'));
      assert.ok(cap.title.length > 0);
    }
  });

  it('resolves system, light, and dark themes cleanly for Day and Dark switching', () => {
    assert.equal(resolveTheme('light', true), 'light');
    assert.equal(resolveTheme('dark', false), 'dark');
    assert.equal(resolveTheme('system', true), 'dark');
    assert.equal(resolveTheme('system', false), 'light');
  });
});

describe('TechText math and spring physics', () => {
  it('clamps, formats signed offsets, and produces deterministic noise', () => {
    assert.equal(clamp01(-0.5), 0);
    assert.equal(clamp01(0.42), 0.42);
    assert.equal(clamp01(2.5), 1);
    assert.equal(smoothstep(0, 1, 0), 0);
    assert.equal(smoothstep(0, 1, 0.5), 0.5);
    assert.equal(smoothstep(0, 1, 1), 1);
    assert.equal(signed(12), '+12');
    assert.equal(signed(-8), '\u22128');
    assert.equal(signed(0), '0');
    assert.equal(noise(1, 2, 3), noise(1, 2, 3));
    assert.ok(approach(0, 10, 0.016, 0.1) > 0);
  });

  it('hits glyphs within bounds and settles kicked glyphs back to rest', () => {
    const glyphs = [createStubGlyph(20, 60), createStubGlyph(70, 110)];
    const bounds = { top: 10, bottom: 90 };

    assert.equal(hitTestGlyph(glyphs, bounds, 40, 50), 0);
    assert.equal(hitTestGlyph(glyphs, bounds, 90, 50), 1);
    assert.equal(hitTestGlyph(glyphs, bounds, 300, 50), -1);
    assert.equal(hitTestGlyph(glyphs, bounds, 40, 200), -1);

    const kicks: Kick[] = [{ index: 0, at: 0, velocity: 400 }];
    const moved = stepGlyphPhysics(
      glyphs,
      kicks,
      0.1,
      0.016,
      20,
      -1,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    );
    assert.equal(moved, true);
    assert.equal(kicks.length, 0);
    assert.ok(glyphs[0].offset.y < 0);

    const frame: SelectionFrame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };
    stepSelectionFrame(frame, glyphs, 1, -1, DEFAULT_TECH_TEXT_SETTINGS, 0.016);
    assert.equal(frame.index, 1);
    assert.ok(frame.alpha > 0);
  });
});
