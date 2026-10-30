import { DesignSystem } from '../types/designSystem';

export interface PresetItem {
  id: string;
  name: string;
  category: string;
  description: string;
  previewImage: string;
  system: DesignSystem;
}

export const PRESET_SYSTEMS: PresetItem[] = [
  {
    id: 'overcast-room',
    name: 'OVERCAST // READING ROOM',
    category: 'Quiet Editorial & Warm Minimalism',
    description: 'A north-lit reading room: warm paper grey, soft ink, one clay accent, and a patient sense of space. Hairline rules replace shadows.',
    previewImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23E9E6E1"/><rect x="40" y="40" width="520" height="320" rx="10" fill="%23F0EDE8" stroke="%23D0CCC5"/><text x="72" y="94" fill="%232B2A28" font-family="Georgia,serif" font-size="26">A room under a grey sky</text><rect x="72" y="114" width="456" height="1" fill="%23D0CCC5"/><rect x="72" y="142" width="300" height="9" fill="%235D5A54" opacity="0.55"/><rect x="72" y="162" width="360" height="9" fill="%235D5A54" opacity="0.35"/><rect x="72" y="220" width="120" height="1" fill="%23D0CCC5"/><rect x="72" y="252" width="128" height="36" rx="9" fill="%23C4704F"/><rect x="216" y="252" width="88" height="36" rx="9" fill="none" stroke="%23BDB8B0"/><circle cx="500" cy="82" r="6" fill="%23C4704F"/></svg>',
    system: {
      identity: {
        name: 'Overcast Room',
        slug: 'overcast-room',
        archetype: 'The Patient Host',
        tagline: 'Quiet software in a room under a grey sky.',
        description: 'Warm paper ground, ink-charcoal text, and a single clay accent. Depth comes from tonal steps and hairline rules; motion is a slow fade, never a bounce.',
        visualEthos: [
          'Warm paper grey (#E9E6E1) as the only ground',
          'Soft ink charcoal (#2B2A28), never pure black',
          'One clay accent (#C4704F) for the primary action',
          'Hairline rules, 8-12px corners, no shadow',
        ],
        mode: 'light',
      },
      colors: {
        palette: [
          { name: 'Overcast Ground', category: 'surface', hex: '#E9E6E1', rgb: '233, 230, 225', hsl: '38, 14%, 90%', role: 'The room. Warm paper grey like diffused window light.', contrastRatio: '1.00:1', wcagPass: false, figmaTokenPath: 'color/surface/ground' },
          { name: 'Cool Panel', category: 'surface', hex: '#D5D7D8', rgb: '213, 215, 216', hsl: '195, 3%, 84%', role: 'Panels and dividers that sit a half-step cooler.', contrastRatio: '1.16:1', wcagPass: false, figmaTokenPath: 'color/surface/panel' },
          { name: 'Paper Light', category: 'surface', hex: '#F0EDE8', rgb: '240, 237, 232', hsl: '36, 22%, 92%', role: 'Cards and reading surfaces.', contrastRatio: '1.07:1', wcagPass: false, figmaTokenPath: 'color/surface/paper' },
          { name: 'Soft Ink', category: 'neutral', hex: '#2B2A28', rgb: '43, 42, 40', hsl: '40, 3%, 16%', role: 'Headlines and body text. Never pure black.', contrastRatio: '11.5:1', wcagPass: true, figmaTokenPath: 'color/text/ink' },
          { name: 'Ink Secondary', category: 'neutral', hex: '#5D5A54', rgb: '93, 90, 84', hsl: '41, 5%, 35%', role: 'Captions, metadata, and quiet interface text.', contrastRatio: '5.5:1', wcagPass: true, figmaTokenPath: 'color/text/secondary' },
          { name: 'Clay Accent', category: 'accent', hex: '#C4704F', rgb: '196, 112, 79', hsl: '17, 47%, 54%', role: 'Marks, borders and fill. Text-bearing buttons step down to #A85B3D.', contrastRatio: '2.9:1', wcagPass: false, figmaTokenPath: 'color/accent/clay' },
          { name: 'Lichen', category: 'semantic', hex: '#5B6557', rgb: '91, 101, 87', hsl: '102, 7%, 37%', role: 'Success and selected states. A slate green-grey, dark enough to read.', contrastRatio: '4.9:1', wcagPass: true, figmaTokenPath: 'color/semantic/lichen' },
          { name: 'Dusty Brick', category: 'semantic', hex: '#96503F', rgb: '150, 80, 63', hsl: '12, 41%, 42%', role: 'Errors. A dusty brick, never alarm red.', contrastRatio: '4.8:1', wcagPass: true, figmaTokenPath: 'color/semantic/brick' },
        ],
        surfaces: {
          canvas: '#E9E6E1',
          surface: '#F0EDE8',
          elevated: '#D5D7D8',
          border: '#D0CCC5',
          textPrimary: '#2B2A28',
          textSecondary: '#5D5A54',
          textMuted: '#8B867D',
        },
      },
      typography: {
        fontFamilies: {
          sans: 'Instrument Sans',
          display: 'Newsreader',
          mono: 'IBM Plex Mono',
        },
        scaleRatio: '1.250 (Major Third)',
        steps: [
          { name: 'Display', size: '44px', lineHeight: '50px', letterSpacing: '-0.02em', weight: '400', sampleText: 'Read the system inside a screen.', cssClass: 'text-5xl font-serif tracking-tight' },
          { name: 'Heading', size: '30px', lineHeight: '37px', letterSpacing: '-0.015em', weight: '400', sampleText: 'A quiet room for design systems', cssClass: 'text-3xl font-serif' },
          { name: 'Subhead', size: '21px', lineHeight: '29px', letterSpacing: '-0.01em', weight: '400', sampleText: 'Volume one, the reading room', cssClass: 'text-xl font-serif' },
          { name: 'Body', size: '15px', lineHeight: '25px', letterSpacing: '0.00em', weight: '400', sampleText: 'Bring one or more screenshots. The system will wait.', cssClass: 'text-[15px] leading-6' },
          { name: 'Interface', size: '13px', lineHeight: '20px', letterSpacing: '0.01em', weight: '500', sampleText: 'synthesize the system', cssClass: 'text-[13px] font-medium' },
          { name: 'Caption', size: '11px', lineHeight: '16px', letterSpacing: '0.08em', weight: '400', sampleText: 'ground · ink · clay', cssClass: 'text-[11px] font-mono tracking-[0.08em]' },
        ],
      },
      spatial: {
        gridBase: '8px base grid',
        spacingScale: [
          { token: 'space-2xs', pixels: '4px', rem: '0.25rem' },
          { token: 'space-xs', pixels: '8px', rem: '0.5rem' },
          { token: 'space-sm', pixels: '12px', rem: '0.75rem' },
          { token: 'space-md', pixels: '16px', rem: '1rem' },
          { token: 'space-lg', pixels: '24px', rem: '1.5rem' },
          { token: 'space-xl', pixels: '32px', rem: '2rem' },
          { token: 'space-2xl', pixels: '48px', rem: '3rem' },
          { token: 'space-3xl', pixels: '64px', rem: '4rem' },
        ],
        radii: [
          { token: 'radius-sm', value: '8px', role: 'Fields, tags, and small controls' },
          { token: 'radius-md', value: '12px', role: 'Cards, panels, and modals' },
          { token: 'radius-pill', value: '999px', role: 'Tags only' },
        ],
        shadows: [
          { token: 'shadow-none', value: 'none', style: 'Depth comes from tonal steps between greys' },
        ],
        motion: {
          easingDefault: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
          durationQuick: '200ms',
          durationStandard: '380ms',
          durationDeliberate: '500ms',
        },
      },
      components: [
        {
          id: 'btn-overcast-primary',
          name: 'Quiet Primary Action',
          category: 'Actions',
          description: 'The one clay action on a screen. Soft corners, no shadow, a slow fade on hover.',
          designRationale: 'A single warm note in an otherwise grey room makes intent obvious without raising the volume.',
          reactCode: `import React from 'react';

export const QuietButton: React.FC<{ label?: string; onClick?: () => void }> = ({
  label = 'synthesize the system',
  onClick,
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-[10px] bg-[#A85B3D] px-4 py-2.5 text-[13px] text-[#FBF8F4] transition-colors duration-300 hover:bg-[#8A4A32]"
  >
    {label}
    <span aria-hidden>→</span>
  </button>
);`,
          vueCode: `<template>
  <button
    class="inline-flex items-center gap-2 rounded-[10px] bg-[#A85B3D] px-4 py-2.5 text-[13px] text-[#FBF8F4] transition-colors duration-300 hover:bg-[#8A4A32]"
  >
    {{ label }}
    <span aria-hidden>→</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'synthesize the system' });
</script>`,
          htmlCode: `<button class="inline-flex items-center gap-2 rounded-[10px] bg-[#A85B3D] px-4 py-2.5 text-[13px] text-[#FBF8F4] transition-colors duration-300 hover:bg-[#8A4A32]">
  synthesize the system <span aria-hidden>→</span>
</button>`,
          figmaTokens: 'comp/button/quiet-primary',
          props: [
            { name: 'label', type: 'string', default: 'synthesize the system', description: 'Button copy' },
            { name: 'onClick', type: '() => void', default: 'undefined', description: 'Press handler' },
          ],
        },
        {
          id: 'card-overcast-note',
          name: 'Reading Note Card',
          category: 'Surfaces',
          description: 'A paper card with a hairline border, a quiet eyebrow, and room to breathe.',
          designRationale: 'Tonal separation and a single rule do the work that a shadow would otherwise do.',
          reactCode: `import React from 'react';

export const ReadingNote: React.FC<{ eyebrow: string; title: string; body: string }> = ({
  eyebrow,
  title,
  body,
}) => (
  <article className="rounded-[12px] border border-[#D0CCC5] bg-[#F0EDE8] p-6">
    <p className="font-mono text-[10px] tracking-[0.08em] text-[#8B867D]">{eyebrow}</p>
    <h3 className="mt-2 font-serif text-[24px] text-[#2B2A28]">{title}</h3>
    <p className="mt-2 max-w-[55ch] text-[14px] leading-6 text-[#5D5A54]">{body}</p>
  </article>
);`,
          vueCode: `<template>
  <article class="rounded-[12px] border border-[#D0CCC5] bg-[#F0EDE8] p-6">
    <p class="font-mono text-[10px] tracking-[0.08em] text-[#8B867D]">{{ eyebrow }}</p>
    <h3 class="mt-2 font-serif text-[24px] text-[#2B2A28]">{{ title }}</h3>
    <p class="mt-2 max-w-[55ch] text-[14px] leading-6 text-[#5D5A54]">{{ body }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; body: string }>();
</script>`,
          htmlCode: `<article class="rounded-[12px] border border-[#D0CCC5] bg-[#F0EDE8] p-6">
  <p class="font-mono text-[10px] tracking-[0.08em] text-[#8B867D]">note</p>
  <h3 class="mt-2 font-serif text-[24px] text-[#2B2A28]">A quieter surface</h3>
  <p class="mt-2 text-[14px] leading-6 text-[#5D5A54]">The room does the work.</p>
</article>`,
          figmaTokens: 'comp/card/reading-note',
          props: [
            { name: 'eyebrow', type: 'string', default: 'note', description: 'Small mono label' },
            { name: 'title', type: 'string', default: 'A quieter surface', description: 'Card heading' },
            { name: 'body', type: 'string', default: 'The room does the work.', description: 'Card copy' },
          ],
        },
        {
          id: 'input-overcast-field',
          name: 'Unhurried Field',
          category: 'Inputs',
          description: 'A plain field with a hairline border and a clay focus state. No glow.',
          designRationale: 'Focus is the only moment the accent is allowed to move into an input.',
          reactCode: `import React from 'react';

export const UnhurriedField: React.FC<{ label: string; placeholder?: string }> = ({
  label,
  placeholder = 'try a line of your own',
}) => (
  <label className="block">
    <span className="font-mono text-[10px] tracking-[0.08em] text-[#8B867D]">{label}</span>
    <input
      placeholder={placeholder}
      className="mt-2 w-full rounded-[10px] border border-[#BDB8B0] bg-transparent px-3.5 py-2.5 text-[13px] text-[#2B2A28] placeholder:text-[#6A655C] focus:border-[#C4704F] focus:outline-none"
    />
  </label>
);`,
          vueCode: `<template>
  <label class="block">
    <span class="font-mono text-[10px] tracking-[0.08em] text-[#8B867D]">{{ label }}</span>
    <input
      :placeholder="placeholder"
      class="mt-2 w-full rounded-[10px] border border-[#BDB8B0] bg-transparent px-3.5 py-2.5 text-[13px] text-[#2B2A28] placeholder:text-[#6A655C] focus:border-[#C4704F] focus:outline-none"
    />
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label: string; placeholder?: string }>(), {
  placeholder: 'try a line of your own',
});
</script>`,
          htmlCode: `<label class="block">
  <span class="font-mono text-[10px] tracking-[0.08em] text-[#8B867D]">preview text</span>
  <input placeholder="try a line of your own" class="mt-2 w-full rounded-[10px] border border-[#BDB8B0] px-3.5 py-2.5 text-[13px]" />
</label>`,
          figmaTokens: 'comp/input/unhurried',
          props: [
            { name: 'label', type: 'string', default: 'preview text', description: 'Field label' },
            { name: 'placeholder', type: 'string', default: 'try a line of your own', description: 'Placeholder copy' },
          ],
        },
        {
          id: 'badge-overcast-tag',
          name: 'Quiet Status Tag',
          category: 'Status',
          description: 'A small pill for state. Lichen for ready, brick for a problem, ink for everything else.',
          designRationale: 'Colour carries meaning here, so the shape stays still and the type stays small.',
          reactCode: `import React from 'react';

const tones = {
  ready: 'border-[#6F7A6A] text-[#6F7A6A]',
  error: 'border-[#A65A4A] text-[#A65A4A]',
  quiet: 'border-[#BDB8B0] text-[#5D5A54]',
};

export const QuietTag: React.FC<{ tone?: keyof typeof tones; children: React.ReactNode }> = ({
  tone = 'quiet',
  children,
}) => (
  <span className={\`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] \${tones[tone]}\`}>
    {children}
  </span>
);`,
          vueCode: `<template>
  <span class="inline-flex items-center gap-1.5 rounded-full border border-[#BDB8B0] px-2.5 py-0.5 font-mono text-[10px] text-[#5D5A54]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'saved' });
</script>`,
          htmlCode: `<span class="inline-flex items-center gap-1.5 rounded-full border border-[#BDB8B0] px-2.5 py-0.5 font-mono text-[10px] text-[#5D5A54]">saved</span>`,
          figmaTokens: 'comp/badge/quiet-status',
          props: [
            { name: 'tone', type: "'ready' | 'error' | 'quiet'", default: 'quiet', description: 'Semantic colour' },
            { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Tag label' },
          ],
        },
      ],
    },
  },
  {
    id: 'monolith-dark',
    name: 'KINETIC // OBSIDIAN',
    category: 'Hyper-Refined Dark Luxury',
    description: 'Precision-engineered dark UI inspired by Linear, Raycast, and Vercel. Deep void black, violet-cyan laser accents, and subtle borders.',
    previewImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%2308090C"><rect width="600" height="400" fill="%2308090C"/><rect x="30" y="30" width="540" height="340" rx="12" fill="%2310121A" stroke="%23222634"/><rect x="50" y="50" width="120" height="24" rx="6" fill="%236366F1"/><rect x="180" y="50" width="80" height="24" rx="6" fill="%231E2333"/><rect x="50" y="100" width="240" height="18" rx="4" fill="%23FFFFFF"/><rect x="50" y="130" width="360" height="12" rx="3" fill="%2364748B"/><rect x="50" y="170" width="150" height="140" rx="8" fill="%23161A26" stroke="%23262D42"/><circle cx="80" cy="200" r="14" fill="%236366F1"/><rect x="104" y="194" width="70" height="12" rx="3" fill="%23E2E8F0"/><rect x="70" y="240" width="100" height="20" rx="4" fill="%2300F2FE"/><rect x="220" y="170" width="150" height="140" rx="8" fill="%23161A26" stroke="%23262D42"/><rect x="390" y="170" width="160" height="140" rx="8" fill="%23161A26" stroke="%23262D42"/><text x="50" y="340" fill="%2394A3B8" font-family="monospace" font-size="12">KINETIC MONOLITH // DS_REV_04</text></svg>',
    system: {
      identity: {
        name: 'Obsidian Kinetic',
        slug: 'obsidian-kinetic',
        archetype: 'The Precision Technologist',
        tagline: 'High-density computational aesthetics with razor-sharp micro-contrast.',
        description: 'Designed for autonomous agents and developer tooling. Built upon deep obsidian backgrounds, monochromatic glass layers, and neon laser indicator lights.',
        visualEthos: [
          'Sub-pixel 1px micro-borders (#1F2430)',
          'Monochromatic hierarchical surfaces with 4% luminance stepping',
          'Electric Indigo (#6366F1) for purposeful primary intent',
          'Monospaced tabular data with zero-friction readability',
        ],
        mode: 'dark',
      },
      colors: {
        palette: [
          { name: 'Core Canvas', category: 'surface', hex: '#090A0F', rgb: '9, 10, 15', hsl: '230, 25%, 5%', role: 'Default deep void background', contrastRatio: '19.8:1', wcagPass: true, figmaTokenPath: 'color/surface/canvas' },
          { name: 'Surface Low', category: 'surface', hex: '#11131B', rgb: '17, 19, 27', hsl: '228, 23%, 9%', role: 'Card and container background', contrastRatio: '16.5:1', wcagPass: true, figmaTokenPath: 'color/surface/low' },
          { name: 'Surface Elevated', category: 'surface', hex: '#191D2B', rgb: '25, 29, 43', hsl: '227, 26%, 13%', role: 'Popover, dropdown and modal tier', contrastRatio: '14.1:1', wcagPass: true, figmaTokenPath: 'color/surface/elevated' },
          { name: 'Border Subtle', category: 'neutral', hex: '#23283B', rgb: '35, 40, 59', hsl: '228, 26%, 18%', role: 'Default container structural stroke', contrastRatio: '12.0:1', wcagPass: true, figmaTokenPath: 'color/border/subtle' },
          { name: 'Electric Indigo', category: 'brand', hex: '#6366F1', rgb: '99, 102, 241', hsl: '239, 84%, 67%', role: 'Primary active brand trigger', contrastRatio: '7.8:1', wcagPass: true, figmaTokenPath: 'color/brand/primary' },
          { name: 'Laser Cyan', category: 'accent', hex: '#06B6D4', rgb: '6, 182, 212', hsl: '189, 94%, 43%', role: 'High-priority status & agent active state', contrastRatio: '8.4:1', wcagPass: true, figmaTokenPath: 'color/accent/cyan' },
          { name: 'Pure Monolith', category: 'neutral', hex: '#F8FAFC', rgb: '248, 250, 252', hsl: '210, 40%, 98%', role: 'Primary headline and body text', contrastRatio: '18.9:1', wcagPass: true, figmaTokenPath: 'color/text/primary' },
          { name: 'Muted Slate', category: 'neutral', hex: '#94A3B8', rgb: '148, 163, 184', hsl: '215, 20%, 65%', role: 'Secondary labels, metadata & captions', contrastRatio: '8.2:1', wcagPass: true, figmaTokenPath: 'color/text/secondary' },
          { name: 'Terminal Emerald', category: 'semantic', hex: '#10B981', rgb: '16, 185, 129', hsl: '160, 84%, 39%', role: 'Success and operational status indicator', contrastRatio: '7.1:1', wcagPass: true, figmaTokenPath: 'color/semantic/success' },
          { name: 'Warning Amber', category: 'semantic', hex: '#F59E0B', rgb: '245, 158, 11', hsl: '38, 92%, 50%', role: 'Alert and rate-limit warning trigger', contrastRatio: '8.5:1', wcagPass: true, figmaTokenPath: 'color/semantic/warning' },
        ],
        surfaces: {
          canvas: '#090A0F',
          surface: '#11131B',
          elevated: '#191D2B',
          border: '#23283B',
          textPrimary: '#F8FAFC',
          textSecondary: '#94A3B8',
          textMuted: '#64748B',
        },
      },
      typography: {
        fontFamilies: {
          sans: 'Plus Jakarta Sans',
          display: 'Space Grotesk',
          mono: 'JetBrains Mono',
        },
        scaleRatio: '1.250 (Major Third)',
        steps: [
          { name: 'Display Heavy', size: '36px', lineHeight: '44px', letterSpacing: '-0.04em', weight: '700', sampleText: 'KINETIC INTELLIGENCE', cssClass: 'text-4xl font-bold tracking-tight' },
          { name: 'Header L1', size: '28px', lineHeight: '36px', letterSpacing: '-0.03em', weight: '600', sampleText: 'System Synthesis Architecture', cssClass: 'text-3xl font-semibold tracking-tight' },
          { name: 'Header L2', size: '22px', lineHeight: '28px', letterSpacing: '-0.02em', weight: '600', sampleText: 'Active Component Pipeline', cssClass: 'text-2xl font-semibold' },
          { name: 'Header L3', size: '18px', lineHeight: '24px', letterSpacing: '-0.01em', weight: '500', sampleText: 'Token Specifications', cssClass: 'text-lg font-medium' },
          { name: 'Body Regular', size: '14px', lineHeight: '22px', letterSpacing: '0.00em', weight: '400', sampleText: 'Deconstructed UI nodes synthesized with algorithmic accuracy.', cssClass: 'text-sm font-normal' },
          { name: 'Code / Monospace', size: '12px', lineHeight: '18px', letterSpacing: '0.04em', weight: '500', sampleText: 'TOKEN_HASH: 0x4F92A_SYNT', cssClass: 'text-xs font-mono tracking-wider' },
        ],
      },
      spatial: {
        gridBase: '8px Base Grid (4px Sub-Unit)',
        spacingScale: [
          { token: 'space-2xs', pixels: '4px', rem: '0.25rem' },
          { token: 'space-xs', pixels: '8px', rem: '0.5rem' },
          { token: 'space-sm', pixels: '12px', rem: '0.75rem' },
          { token: 'space-md', pixels: '16px', rem: '1.0rem' },
          { token: 'space-lg', pixels: '24px', rem: '1.5rem' },
          { token: 'space-xl', pixels: '32px', rem: '2.0rem' },
          { token: 'space-2xl', pixels: '48px', rem: '3.0rem' },
        ],
        radii: [
          { token: 'radius-sm', value: '4px', role: 'Badges, mini tags, inline code' },
          { token: 'radius-md', value: '8px', role: 'Standard buttons, input controls, chips' },
          { token: 'radius-lg', value: '14px', role: 'Cards, drawers, panels' },
          { token: 'radius-full', value: '9999px', role: 'Pill tabs, avatar frames, status dots' },
        ],
        shadows: [
          { token: 'shadow-flat', value: '0 0 0 1px #23283B', style: 'Subtle boundary containment' },
          { token: 'shadow-elevated', value: '0 8px 24px -4px rgba(0,0,0,0.6), 0 0 0 1px #23283B', style: 'Deep atmospheric drop' },
          { token: 'shadow-laser', value: '0 0 20px -2px rgba(99,102,241,0.35)', style: 'Primary active laser halo' },
        ],
        motion: {
          easingDefault: 'cubic-bezier(0.16, 1, 0.3, 1)',
          durationQuick: '150ms',
          durationStandard: '250ms',
          durationDeliberate: '400ms',
        },
      },
      components: [
        {
          id: 'btn-primary-kinetic',
          name: 'Primary Kinetic Action Trigger',
          category: 'Actions',
          description: 'High-contrast interactive trigger with laser hover halo and reactive spring pressing.',
          designRationale: 'Uses Electric Indigo with an internal 1px highlight line to create tangible depth.',
          reactCode: `import React from 'react';
import { Sparkles } from 'lucide-react';

export interface KineticButtonProps {
  label: string;
  onClick?: () => void;
  icon?: boolean;
}

export const KineticButton: React.FC<KineticButtonProps> = ({ label = 'Synthesize Tokens', onClick, icon = true }) => {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-[0.98] border border-indigo-400/30 overflow-hidden cursor-pointer"
    >
      {icon && <Sparkles className="w-4 h-4 text-indigo-200 transition-transform group-hover:rotate-12" />}
      <span>{label}</span>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
    </button>
  );
};`,
          vueCode: `<template>
  <button
    @click="$emit('click')"
    class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-[0.98] border border-indigo-400/30 overflow-hidden cursor-pointer"
  >
    <slot name="icon">
      <span class="text-indigo-200 transition-transform group-hover:rotate-12">✦</span>
    </slot>
    <span>{{ label }}</span>
    <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
}>();
defineEmits(['click']);
</script>`,
          htmlCode: `<button class="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6366F1] text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30 cursor-pointer">
  <span>Synthesize Tokens</span>
</button>`,
          figmaTokens: 'comp/button/primary-kinetic',
          props: [
            { name: 'label', type: 'string', default: 'Synthesize Tokens', description: 'Button text label' },
            { name: 'onClick', type: '() => void', default: 'undefined', description: 'Click event callback' },
            { name: 'icon', type: 'boolean', default: 'true', description: 'Whether to show the leading icon' },
          ],
        },
        {
          id: 'card-metric-hud',
          name: 'Telemetry Metric HUD Card',
          category: 'Surfaces & Data',
          description: 'High-density telemetry component with live status pulse and monospaced quantitative readout.',
          designRationale: 'Maintains extreme readability for autonomous dashboard tracking.',
          reactCode: `import React from 'react';
import { Activity } from 'lucide-react';

export interface MetricCardProps {
  title?: string;
  value?: string;
  delta?: string;
  status?: 'active' | 'warning' | 'idle';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title = 'TOKEN REVISION VELOCITY',
  value = '1,420 ms',
  delta = '+14.2% SYNCHRONIZED',
  status = 'active',
}) => {
  return (
    <div className="p-4 rounded-xl bg-[#11131B] border border-[#23283B] hover:border-indigo-500/40 transition-colors shadow-lg relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">{title}</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <div className="text-2xl font-bold font-mono text-white tracking-tight">{value}</div>
      <div className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1">
        <Activity className="w-3 h-3" />
        <span>{delta}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};`,
          vueCode: `<template>
  <div class="p-4 rounded-xl bg-[#11131B] border border-[#23283B] hover:border-indigo-500/40 transition-colors shadow-lg relative overflow-hidden group">
    <div class="flex items-center justify-between mb-2">
      <span class="text-[11px] font-mono tracking-wider text-slate-400 uppercase">{{ title }}</span>
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </div>
    <div class="text-2xl font-bold font-mono text-white tracking-tight">{{ value }}</div>
    <div class="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1">
      <span>▲ {{ delta }}</span>
    </div>
    <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  value?: string;
  delta?: string;
}>();
</script>`,
          htmlCode: `<div class="p-4 rounded-xl bg-[#11131B] border border-[#23283B] text-white">
  <div class="text-[11px] font-mono text-slate-400">TOKEN REVISION VELOCITY</div>
  <div class="text-2xl font-bold font-mono">1,420 ms</div>
</div>`,
          figmaTokens: 'comp/card/metric-hud',
          props: [
            { name: 'title', type: 'string', default: 'TOKEN REVISION VELOCITY', description: 'HUD title' },
            { name: 'value', type: 'string', default: '1,420 ms', description: 'Primary numeric readout' },
            { name: 'delta', type: 'string', default: '+14.2% SYNCHRONIZED', description: 'Delta trend label' },
          ],
        },
        {
          id: 'input-quantum-search',
          name: 'Quantum Command Field',
          category: 'Form Controls',
          description: 'Tactile input control featuring keyboard shortcut chip and active indigo focus halo.',
          designRationale: 'Seamless interaction for fast developer and AI agent interaction loops.',
          reactCode: `import React, { useState } from 'react';
import { Search, Command } from 'lucide-react';

export interface CommandFieldProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const CommandField: React.FC<CommandFieldProps> = ({
  placeholder = 'Search tokens, components, or prompt variations...',
  onSearch,
}) => {
  const [val, setVal] = useState('');

  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-16 py-2.5 rounded-lg bg-[#11131B] text-sm text-slate-100 placeholder-slate-500 border border-[#23283B] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
      />
      <div className="absolute right-3 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#191D2B] border border-[#23283B] text-[10px] font-mono text-slate-400">
        <Command className="w-3 h-3" />
        <span>K</span>
      </div>
    </div>
  );
};`,
          vueCode: `<template>
  <div class="relative flex items-center w-full">
    <span class="absolute left-3.5 text-slate-500 pointer-events-none">🔍</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="w-full pl-10 pr-16 py-2.5 rounded-lg bg-[#11131B] text-sm text-slate-100 placeholder-slate-500 border border-[#23283B] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
    />
    <div class="absolute right-3 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#191D2B] border border-[#23283B] text-[10px] font-mono text-slate-400">
      <span>⌘K</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();
defineEmits(['update:modelValue']);
</script>`,
          htmlCode: `<div class="relative flex items-center">
  <input class="w-full pl-10 pr-16 py-2.5 rounded-lg bg-[#11131B] text-white border border-[#23283B]" placeholder="Search tokens..." />
</div>`,
          figmaTokens: 'comp/input/command-field',
          props: [
            { name: 'placeholder', type: 'string', default: 'Search tokens...', description: 'Field placeholder' },
            { name: 'onSearch', type: '(v: string) => void', default: 'undefined', description: 'Change callback' },
          ],
        },
        {
          id: 'badge-status-pill',
          name: 'Kinetic Status Pill',
          category: 'Badges & Indicators',
          description: 'Micro-contrast badge with state coloring and crisp border definition.',
          designRationale: 'Compact information architecture element for status, role, and WCAG tags.',
          reactCode: `import React from 'react';

export interface StatusPillProps {
  label: string;
  variant?: 'emerald' | 'cyan' | 'amber' | 'slate';
}

export const StatusPill: React.FC<StatusPillProps> = ({ label = 'WCAG AAA PASS', variant = 'emerald' }) => {
  const styles = {
    emerald: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
    cyan: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
    slate: 'bg-slate-900/60 text-slate-300 border-slate-700/50',
  }[variant];

  return (
    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border \${styles}\`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{label}</span>
    </span>
  );
};`,
          vueCode: `<template>
  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border', variantStyles[variant || 'emerald']]">
    <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  variant?: 'emerald' | 'cyan' | 'amber' | 'slate';
}>();

const variantStyles = {
  emerald: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
  cyan: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30',
  amber: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
  slate: 'bg-slate-900/60 text-slate-300 border-slate-700/50',
};
</script>`,
          htmlCode: `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
  <span>WCAG AAA PASS</span>
</span>`,
          figmaTokens: 'comp/badge/status-pill',
          props: [
            { name: 'label', type: 'string', default: 'WCAG AAA PASS', description: 'Pill text' },
            { name: 'variant', type: 'emerald | cyan | amber | slate', default: 'emerald', description: 'Color mood' },
          ],
        },
      ],
    },
  },
  {
    id: 'acid-brutalist',
    name: 'ACID // BRUTALIST GRID',
    category: 'Neo-Brutalism & Avant-Garde',
    description: 'Electrifying high-voltage aesthetic inspired by Studio Dumbar, DIA, and new media art. Toxic lime accents, stark high contrast, and rigid architectural borders.',
    previewImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%230D0F0A"><rect width="600" height="400" fill="%230D0F0A"/><rect x="40" y="40" width="520" height="320" fill="%23171B12" stroke="%23D4FF00" stroke-width="2"/><rect x="60" y="60" width="160" height="40" fill="%23D4FF00"/><text x="75" y="86" fill="%23000000" font-family="monospace" font-size="16" font-weight="bold">MANIFESTO_01</text><rect x="60" y="130" width="480" height="2" fill="%23D4FF00"/><rect x="60" y="160" width="220" height="150" fill="%23000000" stroke="%23D4FF00" stroke-width="1.5"/><rect x="310" y="160" width="230" height="150" fill="%23D4FF00"/><text x="330" y="220" fill="%23000000" font-family="sans-serif" font-size="28" font-weight="900">RADICAL</text><text x="330" y="255" fill="%23000000" font-family="sans-serif" font-size="28" font-weight="900">SYSTEMS</text></svg>',
    system: {
      identity: {
        name: 'Acid Brutalism',
        slug: 'acid-brutalism',
        archetype: 'The Cultural Provocateur',
        tagline: 'Raw kinetic dynamism colliding with rigid Swiss grid discipline.',
        description: 'Unapologetic visual weight. Built for disruptive creative tech, avant-garde design agencies, and next-generation art platforms.',
        visualEthos: [
          'High-voltage Acid Lime (#D4FF00) as dominant focal catalyst',
          'Rigid 2px solid offset border geometry with zero radius',
          'Heavyweight all-caps kinetic typographic headers',
          'Brutalist drop shadows with sharp 4px offsets without blur',
        ],
        mode: 'dark',
      },
      colors: {
        palette: [
          { name: 'Pitch Void', category: 'surface', hex: '#0B0D08', rgb: '11, 13, 8', hsl: '84, 24%, 4%', role: 'Root canvas backdrop', contrastRatio: '20.1:1', wcagPass: true, figmaTokenPath: 'color/surface/void' },
          { name: 'Acid Lime', category: 'brand', hex: '#D4FF00', rgb: '212, 255, 0', hsl: '70, 100%, 50%', role: 'Electric primary activator & brand trigger', contrastRatio: '18.4:1', wcagPass: true, figmaTokenPath: 'color/brand/acid' },
          { name: 'Concrete Carbon', category: 'surface', hex: '#161912', rgb: '22, 25, 18', hsl: '86, 16%, 8%', role: 'Secondary surface blocks and cards', contrastRatio: '15.3:1', wcagPass: true, figmaTokenPath: 'color/surface/carbon' },
          { name: 'Stark White', category: 'neutral', hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0, 0%, 100%', role: 'High-contrast typography', contrastRatio: '19.5:1', wcagPass: true, figmaTokenPath: 'color/text/primary' },
          { name: 'Wireframe Lime', category: 'neutral', hex: '#8C9E26', rgb: '140, 158, 38', hsl: '69, 61%, 38%', role: 'Structural architectural lines', contrastRatio: '8.1:1', wcagPass: true, figmaTokenPath: 'color/border/wireframe' },
          { name: 'Infra Orange', category: 'semantic', hex: '#FF4D00', rgb: '255, 77, 0', hsl: '18, 100%, 50%', role: 'Destructive action & urgent hazard flag', contrastRatio: '7.4:1', wcagPass: true, figmaTokenPath: 'color/semantic/hazard' },
        ],
        surfaces: {
          canvas: '#0B0D08',
          surface: '#161912',
          elevated: '#21261B',
          border: '#D4FF00',
          textPrimary: '#FFFFFF',
          textSecondary: '#D4FF00',
          textMuted: '#8C9E26',
        },
      },
      typography: {
        fontFamilies: {
          sans: 'Space Grotesk',
          display: 'Syne',
          mono: 'JetBrains Mono',
        },
        scaleRatio: '1.333 (Perfect Fourth)',
        steps: [
          { name: 'Poster Kinetic', size: '48px', lineHeight: '48px', letterSpacing: '-0.05em', weight: '800', sampleText: 'RAW GEOMETRY', cssClass: 'text-5xl font-black uppercase tracking-tighter' },
          { name: 'Title Block', size: '32px', lineHeight: '36px', letterSpacing: '-0.03em', weight: '700', sampleText: 'STRUCTURAL DISRUPTION', cssClass: 'text-3xl font-bold uppercase' },
          { name: 'Subhead Mono', size: '18px', lineHeight: '24px', letterSpacing: '0.02em', weight: '600', sampleText: 'GRID // SECTION 09', cssClass: 'text-lg font-mono font-semibold' },
          { name: 'Body Grotesk', size: '15px', lineHeight: '24px', letterSpacing: '0.00em', weight: '400', sampleText: 'Mathematical rhythm combined with anti-decorative brutalist mechanics.', cssClass: 'text-base font-normal' },
        ],
      },
      spatial: {
        gridBase: '8px Strict Modular Grid',
        spacingScale: [
          { token: 'space-xs', pixels: '8px', rem: '0.5rem' },
          { token: 'space-sm', pixels: '16px', rem: '1.0rem' },
          { token: 'space-md', pixels: '24px', rem: '1.5rem' },
          { token: 'space-lg', pixels: '32px', rem: '2.0rem' },
          { token: 'space-xl', pixels: '48px', rem: '3.0rem' },
        ],
        radii: [
          { token: 'radius-none', value: '0px', role: 'All buttons, cards, modals (pure brutalist zero curve)' },
          { token: 'radius-sharp', value: '2px', role: 'Micro chips only' },
        ],
        shadows: [
          { token: 'shadow-brutal-lime', value: '4px 4px 0px #D4FF00', style: 'Hard 90-degree offset with no blur' },
          { token: 'shadow-brutal-white', value: '4px 4px 0px #FFFFFF', style: 'High contrast stark drop' },
        ],
        motion: {
          easingDefault: 'cubic-bezier(0, 0, 0.2, 1)',
          durationQuick: '100ms',
          durationStandard: '180ms',
          durationDeliberate: '280ms',
        },
      },
      components: [
        {
          id: 'btn-brutalist-block',
          name: 'Brutalist Block Action',
          category: 'Actions',
          description: 'Zero-radius hard offset button with immediate tactile displacement on click.',
          designRationale: 'Instant physical snap without smooth transitions, reflecting neo-brutalist honesty.',
          reactCode: `import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface BrutalButtonProps {
  label: string;
  onClick?: () => void;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({ label = 'EXECUTE COMMAND', onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4FF00] text-black font-mono font-bold text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FFFFFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform cursor-pointer"
    >
      <span>{label}</span>
      <ArrowUpRight className="w-4 h-4 stroke-[3]" />
    </button>
  );
};`,
          vueCode: `<template>
  <button
    @click="$emit('click')"
    class="inline-flex items-center gap-2 px-6 py-3 bg-[#D4FF00] text-black font-mono font-bold text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FFFFFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform cursor-pointer"
  >
    <span>{{ label }}</span>
    <span>↗</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>();
defineEmits(['click']);
</script>`,
          htmlCode: `<button class="inline-flex items-center gap-2 px-6 py-3 bg-[#D4FF00] text-black font-mono font-bold text-sm border-2 border-black shadow-[4px_4px_0px_#FFFFFF]">
  <span>EXECUTE COMMAND</span>
</button>`,
          figmaTokens: 'comp/button/brutalist-block',
          props: [
            { name: 'label', type: 'string', default: 'EXECUTE COMMAND', description: 'Action label' },
            { name: 'onClick', type: '() => void', default: 'undefined', description: 'Trigger function' },
          ],
        },
        {
          id: 'card-manifesto-block',
          name: 'Editorial Manifesto Frame',
          category: 'Surfaces & Layout',
          description: 'High-contrast stark section card framed with 2px acid lime perimeter.',
          designRationale: 'Frames avant-garde content with structural authority.',
          reactCode: `import React from 'react';

export const ManifestoCard: React.FC<{ number?: string; title?: string; body?: string }> = ({
  number = '01 // ARCHITECTURE',
  title = 'NON-CONFORMIST CODEBASE',
  body = 'Algorithmic grid execution where visual hierarchy is dictated by pure contrast rather than gradient fluff.',
}) => {
  return (
    <div className="p-6 bg-[#161912] border-2 border-[#D4FF00] shadow-[6px_6px_0px_#D4FF00] text-white">
      <div className="text-xs font-mono font-bold text-[#D4FF00] mb-2">{number}</div>
      <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">{title}</h3>
      <p className="text-sm font-mono text-zinc-300 leading-relaxed">{body}</p>
    </div>
  );
};`,
          vueCode: `<template>
  <div class="p-6 bg-[#161912] border-2 border-[#D4FF00] shadow-[6px_6px_0px_#D4FF00] text-white">
    <div class="text-xs font-mono font-bold text-[#D4FF00] mb-2">{{ number }}</div>
    <h3 class="text-xl font-bold uppercase tracking-tight mb-2 text-white">{{ title }}</h3>
    <p class="text-sm font-mono text-zinc-300 leading-relaxed">{{ body }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ number?: string; title?: string; body?: string }>();
</script>`,
          htmlCode: `<div class="p-6 bg-[#161912] border-2 border-[#D4FF00] shadow-[6px_6px_0px_#D4FF00] text-white">
  <div class="text-xs font-mono text-[#D4FF00]">01 // ARCHITECTURE</div>
  <h3 class="text-xl font-bold uppercase">NON-CONFORMIST CODEBASE</h3>
</div>`,
          figmaTokens: 'comp/card/manifesto-frame',
          props: [
            { name: 'number', type: 'string', default: '01 // ARCHITECTURE', description: 'Index numeral' },
            { name: 'title', type: 'string', default: 'NON-CONFORMIST CODEBASE', description: 'Section title' },
            { name: 'body', type: 'string', default: 'Algorithmic grid execution...', description: 'Description' },
          ],
        },
      ],
    },
  },
  {
    id: 'swiss-editorial',
    name: 'HELVETIC // SWISS ARCHIVE',
    category: 'High-Art Editorial & Publishing',
    description: 'Timeless typographic precision inspired by Josef Müller-Brockmann, Pentagram editorial works, and Bureau Borsche. Warm papyrus, deep umber, and strict column rhythm.',
    previewImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23F4EFEA"><rect width="600" height="400" fill="%23F4EFEA"/><rect x="40" y="40" width="520" height="320" fill="%23FFFFFF" stroke="%23E2DBD2"/><text x="70" y="90" fill="%231E1B18" font-family="serif" font-size="28" font-weight="600">Archival Typographic Index</text><rect x="70" y="110" width="460" height="1" fill="%231E1B18"/><rect x="70" y="140" width="130" height="170" fill="%23EFE9E0"/><text x="85" y="180" fill="%23A84B24" font-family="sans-serif" font-size="12" font-weight="bold">FOLIO // 1974</text><rect x="230" y="140" width="300" height="12" fill="%231E1B18"/><rect x="230" y="165" width="280" height="8" fill="%2368625B"/><rect x="230" y="185" width="260" height="8" fill="%2368625B"/><rect x="230" y="220" width="100" height="32" fill="%231E1B18"/></svg>',
    system: {
      identity: {
        name: 'Helvetic Editorial Archive',
        slug: 'helvetic-editorial',
        archetype: 'The Curatorial Master',
        tagline: 'Refined intellectual typography and contemplative warm minimalism.',
        description: 'Engineered for luxury publications, high-end cultural institutions, and thoughtful long-form applications.',
        visualEthos: [
          'Warm Papyrus (#F4EFEA) organic paper substrate',
          'Deep Umber Charcoal (#1E1B18) for authoritative contrast',
          'Terracotta Sienna (#A84B24) as subtle archival focal accent',
          'Rigorous baseline typographic alignment with generous whitespace',
        ],
        mode: 'light',
      },
      colors: {
        palette: [
          { name: 'Warm Papyrus Canvas', category: 'surface', hex: '#F4EFEA', rgb: '244, 239, 234', hsl: '30, 29%, 94%', role: 'Tactile paper background', contrastRatio: '18.2:1', wcagPass: true, figmaTokenPath: 'color/surface/papyrus' },
          { name: 'Pure Parchment', category: 'surface', hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0, 0%, 100%', role: 'Elevated content cards', contrastRatio: '19.4:1', wcagPass: true, figmaTokenPath: 'color/surface/pure' },
          { name: 'Deep Umber', category: 'neutral', hex: '#1E1B18', rgb: '30, 27, 24', hsl: '30, 11%, 11%', role: 'Primary typographic headlines', contrastRatio: '16.7:1', wcagPass: true, figmaTokenPath: 'color/text/umber' },
          { name: 'Terracotta Accent', category: 'accent', hex: '#A84B24', rgb: '168, 75, 36', hsl: '18, 65%, 40%', role: 'Curatorial highlight and callout', contrastRatio: '8.3:1', wcagPass: true, figmaTokenPath: 'color/accent/terracotta' },
          { name: 'Stone Ochre Border', category: 'neutral', hex: '#E2DBD2', rgb: '226, 219, 210', hsl: '34, 23%, 85%', role: 'Delicate structural rule line', contrastRatio: '13.1:1', wcagPass: true, figmaTokenPath: 'color/border/stone' },
        ],
        surfaces: {
          canvas: '#F4EFEA',
          surface: '#FFFFFF',
          elevated: '#FAF8F5',
          border: '#E2DBD2',
          textPrimary: '#1E1B18',
          textSecondary: '#68625B',
          textMuted: '#968E85',
        },
      },
      typography: {
        fontFamilies: {
          sans: 'Plus Jakarta Sans',
          display: 'Syne',
          mono: 'JetBrains Mono',
        },
        scaleRatio: '1.200 (Minor Third)',
        steps: [
          { name: 'Editorial Headline', size: '36px', lineHeight: '42px', letterSpacing: '-0.02em', weight: '700', sampleText: 'THE ARCHIVAL SYNTHESIS', cssClass: 'text-4xl font-serif font-bold text-[#1E1B18]' },
          { name: 'Section Header', size: '24px', lineHeight: '32px', letterSpacing: '-0.01em', weight: '600', sampleText: 'Vol. IV / Typographic Balance', cssClass: 'text-2xl font-serif font-semibold text-[#1E1B18]' },
          { name: 'Body Reading', size: '15px', lineHeight: '26px', letterSpacing: '0.01em', weight: '400', sampleText: 'A disciplined study of spatial ratios and organic contrast.', cssClass: 'text-base font-sans text-[#1E1B18]' },
          { name: 'Colophon Meta', size: '12px', lineHeight: '18px', letterSpacing: '0.06em', weight: '600', sampleText: 'EDITION: 1982 // FOLIO B', cssClass: 'text-xs font-mono uppercase tracking-widest text-[#A84B24]' },
        ],
      },
      spatial: {
        gridBase: '6px / 12 Column Editorial Grid',
        spacingScale: [
          { token: 'space-xs', pixels: '6px', rem: '0.375rem' },
          { token: 'space-sm', pixels: '12px', rem: '0.75rem' },
          { token: 'space-md', pixels: '24px', rem: '1.5rem' },
          { token: 'space-lg', pixels: '36px', rem: '2.25rem' },
          { token: 'space-xl', pixels: '48px', rem: '3.0rem' },
        ],
        radii: [
          { token: 'radius-subtle', value: '2px', role: 'Editorial subtle softening' },
          { token: 'radius-card', value: '4px', role: 'Framed images and panels' },
        ],
        shadows: [
          { token: 'shadow-paper', value: '0 2px 12px rgba(30, 27, 24, 0.05)', style: 'Tactile paper resting elevation' },
        ],
        motion: {
          easingDefault: 'cubic-bezier(0.25, 1, 0.5, 1)',
          durationQuick: '200ms',
          durationStandard: '350ms',
          durationDeliberate: '600ms',
        },
      },
      components: [
        {
          id: 'btn-editorial-charcoal',
          name: 'Colophon Monolith Button',
          category: 'Actions',
          description: 'Understated charcoal button with delicate terracotta border transition.',
          designRationale: 'Allows editorial content to remain the protagonist while providing clear intentional actions.',
          reactCode: `import React from 'react';

export const EditorialButton: React.FC<{ label?: string; onClick?: () => void }> = ({
  label = 'Access Complete Archive',
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 px-6 py-2.5 rounded-[2px] bg-[#1E1B18] text-[#F4EFEA] font-serif text-sm tracking-wide hover:bg-[#A84B24] transition-colors duration-300 border border-[#1E1B18] cursor-pointer"
    >
      <span>{label}</span>
      <span className="font-mono text-xs">→</span>
    </button>
  );
};`,
          vueCode: `<template>
  <button
    @click="$emit('click')"
    class="inline-flex items-center gap-3 px-6 py-2.5 rounded-[2px] bg-[#1E1B18] text-[#F4EFEA] font-serif text-sm tracking-wide hover:bg-[#A84B24] transition-colors duration-300 border border-[#1E1B18] cursor-pointer"
  >
    <span>{{ label }}</span>
    <span class="font-mono text-xs">→</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>();
defineEmits(['click']);
</script>`,
          htmlCode: `<button class="inline-flex items-center gap-3 px-6 py-2.5 bg-[#1E1B18] text-[#F4EFEA] font-serif text-sm">
  <span>Access Complete Archive</span>
</button>`,
          figmaTokens: 'comp/button/editorial-charcoal',
        },
      ],
    },
  },
];
