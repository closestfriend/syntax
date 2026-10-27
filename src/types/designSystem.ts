export interface ColorToken {
  name: string;
  category: 'brand' | 'neutral' | 'semantic' | 'surface' | 'accent' | string;
  hex: string;
  rgb?: string;
  hsl?: string;
  role: string;
  contrastRatio?: string;
  wcagPass?: boolean;
  figmaTokenPath: string;
}

export interface SurfaceTokens {
  canvas: string;
  surface: string;
  elevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted?: string;
}

export interface ColorArchitecture {
  palette: ColorToken[];
  surfaces: SurfaceTokens;
}

export interface TypographyStep {
  name: string;
  size: string;
  lineHeight: string;
  letterSpacing?: string;
  weight: string;
  sampleText?: string;
  cssClass: string;
}

export interface TypographySystem {
  fontFamilies: {
    sans: string;
    display: string;
    mono?: string;
  };
  scaleRatio: string;
  steps: TypographyStep[];
}

export interface SpacingToken {
  token: string;
  pixels: string;
  rem: string;
}

export interface RadiusToken {
  token: string;
  value: string;
  role: string;
}

export interface ShadowToken {
  token: string;
  value: string;
  style?: string;
}

export interface MotionTokens {
  easingDefault: string;
  durationQuick: string;
  durationStandard: string;
  durationDeliberate: string;
}

export interface SpatialArchitecture {
  gridBase: string;
  spacingScale: SpacingToken[];
  radii: RadiusToken[];
  shadows: ShadowToken[];
  motion: MotionTokens;
}

export interface ComponentProp {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

export interface DesignComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  designRationale?: string;
  reactCode: string;
  vueCode: string;
  htmlCode?: string;
  figmaTokens?: string;
  props?: ComponentProp[];
}

export interface BrandIdentity {
  name: string;
  slug: string;
  archetype: string;
  tagline: string;
  description: string;
  visualEthos: string[];
  mode: 'dark' | 'light' | 'adaptive';
}

export interface DesignSystem {
  identity: BrandIdentity;
  colors: ColorArchitecture;
  typography: TypographySystem;
  spatial: SpatialArchitecture;
  components: DesignComponent[];
}

export interface ScreenshotItem {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
  size?: number;
}

export interface GeneratedAsset {
  id: string;
  name: string;
  imageUrl: string;
  originalPrompt: string;
  synthesizedPrompt: string;
  designSystemAlignment: string;
  appliedTokens: string[];
  aspectRatio: string;
  imageSize: string;
  assetType: string;
  createdAt: string;
  parentAssetId?: string;
}

