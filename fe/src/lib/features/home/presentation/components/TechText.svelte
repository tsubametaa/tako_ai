<script lang="ts">
  import { untrack } from 'svelte';
  import {
    DEFAULT_TECH_TEXT_SETTINGS,
    type TechTextAlign,
    type TechTextIntro,
    type TechTextLineStyle,
    type TechTextReveal,
    type TechTextSettings,
  } from '../../domain/techText';
  import {
    createTechTextEngine,
    type TechTextEngine,
  } from '../techText/techTextEngine';

  interface Props {
    text?: string;
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    letterSpacing?: number;
    color?: string;
    accentColor?: string;
    shadowColor?: string;
    shadowOffset?: number;
    align?: TechTextAlign;
    reach?: number;
    softness?: number;
    dashLength?: number;
    dashGap?: number;
    strokeWidth?: number;
    lineStyle?: TechTextLineStyle;
    reveal?: TechTextReveal;
    specks?: number;
    selection?: boolean;
    labels?: boolean;
    draggable?: boolean;
    bounce?: number;
    sweep?: boolean;
    speed?: number;
    clickKick?: boolean;
    intro?: TechTextIntro;
    introDuration?: number;
    guides?: boolean;
    class?: string;
    style?: string;
  }

  let {
    text = DEFAULT_TECH_TEXT_SETTINGS.text,
    fontFamily = DEFAULT_TECH_TEXT_SETTINGS.fontFamily,
    fontWeight = DEFAULT_TECH_TEXT_SETTINGS.fontWeight,
    fontSize = DEFAULT_TECH_TEXT_SETTINGS.fontSize,
    letterSpacing = DEFAULT_TECH_TEXT_SETTINGS.letterSpacing,
    color = DEFAULT_TECH_TEXT_SETTINGS.color,
    accentColor = DEFAULT_TECH_TEXT_SETTINGS.accentColor,
    shadowColor = DEFAULT_TECH_TEXT_SETTINGS.shadowColor,
    shadowOffset = DEFAULT_TECH_TEXT_SETTINGS.shadowOffset,
    align = DEFAULT_TECH_TEXT_SETTINGS.align,
    reach = DEFAULT_TECH_TEXT_SETTINGS.reach,
    softness = DEFAULT_TECH_TEXT_SETTINGS.softness,
    dashLength = DEFAULT_TECH_TEXT_SETTINGS.dashLength,
    dashGap = DEFAULT_TECH_TEXT_SETTINGS.dashGap,
    strokeWidth = DEFAULT_TECH_TEXT_SETTINGS.strokeWidth,
    lineStyle = DEFAULT_TECH_TEXT_SETTINGS.lineStyle,
    reveal = DEFAULT_TECH_TEXT_SETTINGS.reveal,
    specks = DEFAULT_TECH_TEXT_SETTINGS.specks,
    selection = DEFAULT_TECH_TEXT_SETTINGS.selection,
    labels = DEFAULT_TECH_TEXT_SETTINGS.labels,
    draggable = DEFAULT_TECH_TEXT_SETTINGS.draggable,
    bounce = DEFAULT_TECH_TEXT_SETTINGS.bounce,
    sweep = DEFAULT_TECH_TEXT_SETTINGS.sweep,
    speed = DEFAULT_TECH_TEXT_SETTINGS.speed,
    clickKick = DEFAULT_TECH_TEXT_SETTINGS.clickKick,
    intro = DEFAULT_TECH_TEXT_SETTINGS.intro,
    introDuration = DEFAULT_TECH_TEXT_SETTINGS.introDuration,
    guides = DEFAULT_TECH_TEXT_SETTINGS.guides,
    class: className = '',
    style = '',
  }: Props = $props();

  let containerEl = $state<HTMLDivElement | null>(null);
  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let engine: TechTextEngine | null = null;

  const settings = $derived<TechTextSettings>({
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    color,
    accentColor,
    shadowColor,
    shadowOffset,
    align,
    reach,
    softness,
    dashLength,
    dashGap,
    strokeWidth,
    lineStyle,
    reveal,
    specks,
    selection,
    labels,
    draggable,
    bounce,
    sweep,
    speed,
    clickKick,
    intro,
    introDuration,
    guides,
  });

  $effect(() => {
    if (!containerEl || !canvasEl) return;
    const instance = createTechTextEngine(
      containerEl,
      canvasEl,
      untrack(() => settings),
    );
    engine = instance;
    return () => {
      instance.destroy();
      if (engine === instance) engine = null;
    };
  });

  $effect(() => {
    engine?.updateSettings(settings);
  });
</script>

<div
  bind:this={containerEl}
  class="relative h-full w-full touch-pan-y select-none {className}"
  {style}
  role="img"
  aria-label={text}
>
  <canvas bind:this={canvasEl} class="block h-full w-full"></canvas>
</div>
