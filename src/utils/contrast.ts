/**
 * WCAG contrast maths.
 *
 * Ratio is always measured between a foreground color and a specific
 * background — there is no such thing as a context-free contrast number.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const clean = hex.trim().replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function channelLuminance(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

/** Contrast ratio between two hex colors, from 1:1 to 21:1. */
export function contrastRatio(foreground: string, background: string): number | null {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  if (a === null || b === null) return null;
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export function formatRatio(ratio: number | null): string {
  if (ratio === null) return 'n/a';
  return `${ratio.toFixed(2)}:1`;
}

/**
 * AA needs 4.5:1 for body text and 3:1 for large text (18.66px bold / 24px).
 * Non-text UI boundaries need 3:1.
 */
export function wcagVerdict(ratio: number | null): 'pass' | 'large' | 'fail' {
  if (ratio === null) return 'fail';
  if (ratio >= 4.5) return 'pass';
  if (ratio >= 3) return 'large';
  return 'fail';
}

export function verdictLabel(verdict: 'pass' | 'large' | 'fail'): string {
  if (verdict === 'pass') return 'aa';
  if (verdict === 'large') return 'large only';
  return 'below aa';
}
