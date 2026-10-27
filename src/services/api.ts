import { DesignSystem, DesignComponent, GeneratedAsset } from '../types/designSystem';

export interface AnalyzeRequestImage {
  base64: string;
  mimeType?: string;
  name?: string;
}

export async function analyzeScreenshotsApi(
  images: AnalyzeRequestImage[],
  brandContext?: string
): Promise<{ success: boolean; data: DesignSystem; meta: any }> {
  const response = await fetch('/api/v1/design-system/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images, brandContext }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `Failed to analyze screenshot (HTTP ${response.status})`);
  }

  return response.json();
}

export async function generateComponentVariantApi(
  prompt: string,
  designSystem: DesignSystem
): Promise<{ success: boolean; data: DesignComponent }> {
  const response = await fetch('/api/v1/design-system/generate-variant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, designSystem }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `Failed to generate component variant (HTTP ${response.status})`);
  }

  return response.json();
}

export async function generateDesignAssetApi(params: {
  prompt: string;
  designSystem: DesignSystem;
  assetType?: string;
  aspectRatio?: string;
  imageSize?: string;
}): Promise<{ success: boolean; data: GeneratedAsset }> {
  const response = await fetch('/api/v1/design-system/generate-asset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `Failed to generate design asset (HTTP ${response.status})`);
  }

  return response.json();
}

export async function editDesignAssetApi(params: {
  base64: string;
  mimeType?: string;
  editInstruction: string;
  designSystem: DesignSystem;
  aspectRatio?: string;
  imageSize?: string;
  parentAssetId?: string;
}): Promise<{ success: boolean; data: GeneratedAsset }> {
  const response = await fetch('/api/v1/design-system/edit-asset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `Failed to edit design asset (HTTP ${response.status})`);
  }

  return response.json();
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'offline', hasApiKey: false };
    return res.json();
  } catch {
    return { status: 'unreachable', hasApiKey: false };
  }
}

