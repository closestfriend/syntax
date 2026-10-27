import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  Copy, 
  Check, 
  SlidersHorizontal, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Eye, 
  X, 
  Upload, 
  ArrowRight,
  Maximize2,
  Ratio
} from 'lucide-react';
import { DesignSystem, GeneratedAsset } from '../types/designSystem';
import { generateDesignAssetApi, editDesignAssetApi } from '../services/api';

interface ImageAssetStudioProps {
  system: DesignSystem;
  assets: GeneratedAsset[];
  onAddAsset: (asset: GeneratedAsset) => void;
  onUpdateAsset: (asset: GeneratedAsset) => void;
  onSetAsScreenshot?: (dataUrl: string, name: string) => void;
}

export const ImageAssetStudio: React.FC<ImageAssetStudioProps> = ({
  system,
  assets,
  onAddAsset,
  onUpdateAsset,
  onSetAsScreenshot,
}) => {
  const [prompt, setPrompt] = useState('');
  const [assetType, setAssetType] = useState<string>('ui-artifact');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [imageSize, setImageSize] = useState<string>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Editing state
  const [editingAsset, setEditingAsset] = useState<GeneratedAsset | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Zoom lightbox
  const [lightboxAsset, setLightboxAsset] = useState<GeneratedAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleSuggestions = [
    { label: '3D Floating Holographic Core', type: 'ui-artifact' },
    { label: 'Dark Atmospheric Kinetic Grid Wallpaper', type: 'texture-pattern' },
    { label: 'Minimalist Monogram Security Shield Badge', type: 'badge-icon' },
    { label: 'Cinematic Hero Banner with Laser Glass Horizon', type: 'hero-visual' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await generateDesignAssetApi({
        prompt,
        designSystem: system,
        assetType,
        aspectRatio,
        imageSize,
      });

      if (res.data) {
        onAddAsset(res.data);
        setPrompt('');
      }
    } catch (err: any) {
      console.error('Asset generation failed:', err);
      setGenerationError(err.message || 'Failed to generate visual asset with gemini-nano-banana-2.1.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset || !editInstruction.trim() || isEditing) return;

    setIsEditing(true);
    setEditError(null);

    try {
      const res = await editDesignAssetApi({
        base64: editingAsset.imageUrl,
        editInstruction,
        designSystem: system,
        aspectRatio: editingAsset.aspectRatio,
        imageSize: editingAsset.imageSize,
        parentAssetId: editingAsset.id,
      });

      if (res.data) {
        onAddAsset(res.data);
        setEditingAsset(null);
        setEditInstruction('');
      }
    } catch (err: any) {
      console.error('Asset edit failed:', err);
      setEditError(err.message || 'Failed to edit asset with gemini-nano-banana-2.1.');
    } finally {
      setIsEditing(false);
    }
  };

  const copyDataUrl = (asset: GeneratedAsset) => {
    navigator.clipboard.writeText(asset.imageUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAsset = (asset: GeneratedAsset) => {
    const a = document.createElement('a');
    a.href = asset.imageUrl;
    a.download = `${asset.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${asset.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header & Model Badge */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#121422] via-[#0E111C] to-[#090A0F] border border-indigo-500/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 font-mono text-xs border border-indigo-700/50">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>GEMINI-NANO-BANANA-2.1</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 font-mono text-xs border border-cyan-700/50">
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>TOKEN-CONSTRAINED LLM INFERENCE</span>
            </span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Design-System-Aware Visual Asset Generation & Studio
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Enter any prompt — regardless of how generic or informal. The Gemini LLM automatically analyzes 
            and rewrites your prompt to strictly adhere to <strong className="text-white">{system.identity.name}</strong>'s exact 
            color tokens ({system.colors.palette.slice(0, 3).map((c) => c.hex).join(', ')}), surface contrast, and aesthetic archetype. 
            High-fidelity visuals are rendered via <strong className="text-indigo-300">gemini-nano-banana-2.1</strong>.
          </p>

          {/* Generator Form */}
          <form onSubmit={handleGenerate} className="mt-6 space-y-4">
            <div className="relative">
              <Sparkles className="absolute left-4 top-3.5 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your desired asset: e.g. 'futuristic security badge', 'abstract geometric orb', 'analytics hero wave'..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#090A0F] border border-[#23293D] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>

            {/* Controls Bar: Asset Role, Aspect Ratio, Resolution */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Asset Role Selector */}
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#141826] border border-[#222738] text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ui-artifact">3D UI Artifact & Icon</option>
                  <option value="hero-visual">Hero Key Visual</option>
                  <option value="badge-icon">Monogram / Brand Badge</option>
                  <option value="texture-pattern">Texture & Wallpaper</option>
                  <option value="editorial-still">Editorial Art Still</option>
                </select>

                {/* Aspect Ratio Selector */}
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#141826] border border-[#222738] text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="4:3">4:3 Standard</option>
                  <option value="3:4">3:4 Poster</option>
                  <option value="1:4">1:4 Header Banner</option>
                  <option value="4:1">4:1 Ribbon</option>
                </select>

                {/* Resolution Selector */}
                <div className="flex items-center rounded-lg bg-[#141826] border border-[#222738] p-0.5">
                  {(['1K', '2K'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setImageSize(sz)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                        imageSize === sz
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isGenerating || !prompt.trim()
                    ? 'bg-indigo-950/50 text-indigo-400/50 border border-indigo-900 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>SYNTHESIZING & RENDERING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>GENERATE BRAND ASSET</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">Inspire:</span>
            {sampleSuggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setPrompt(s.label);
                  setAssetType(s.type);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#141826] hover:bg-indigo-950 text-[11px] font-mono text-slate-400 hover:text-indigo-200 border border-[#222738] transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {generationError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300">
              {generationError}
            </div>
          )}
        </div>
      </div>

      {/* Generated Assets Collection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-heading text-lg font-bold text-white tracking-tight">
              Design System Asset Catalog ({assets.length})
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              High-resolution visual artifacts rendered with exact brand palette alignment.
            </p>
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#11131B] border border-[#1E2333]">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white">No visual assets generated yet</h4>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-md mx-auto">
              Type any prompt above to generate UI artifacts, hero graphics, and texture patterns powered by Gemini prompt logic and gemini-nano-banana-2.1.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-2xl bg-[#10121A] border border-[#1E2436] hover:border-indigo-500/50 transition-all shadow-xl overflow-hidden flex flex-col justify-between"
              >
                {/* Image Container with overlay actions */}
                <div className="relative aspect-square w-full bg-[#08090F] overflow-hidden flex items-center justify-center">
                  <img
                    src={asset.imageUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/75 backdrop-blur-md text-white border border-white/20">
                      {asset.aspectRatio} • {asset.imageSize}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-950/80 backdrop-blur-md text-indigo-300 border border-indigo-700/50">
                      {asset.assetType}
                    </span>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => setLightboxAsset(asset)}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white cursor-pointer backdrop-blur-md"
                      title="Enlarge"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAsset(asset);
                        setEditInstruction('');
                      }}
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer backdrop-blur-md shadow-lg"
                      title="Edit this asset with AI"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadAsset(asset)}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white cursor-pointer backdrop-blur-md"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 space-y-3 bg-[#0E1017]">
                  <div>
                    <h5 className="text-sm font-bold text-white font-heading truncate">
                      {asset.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      Prompt: "{asset.originalPrompt}"
                    </p>
                  </div>

                  {/* Design System Rationale Pill */}
                  <div className="p-2.5 rounded-lg bg-[#08090F] border border-[#1A1E2C] text-[11px] text-slate-300 font-sans leading-relaxed">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 uppercase font-semibold mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Tokens Enforced by Gemini LLM</span>
                    </div>
                    {asset.designSystemAlignment}
                  </div>

                  {/* Token tags */}
                  {asset.appliedTokens && asset.appliedTokens.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {asset.appliedTokens.slice(0, 3).map((tok, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#141826] text-slate-400 border border-[#202538]"
                        >
                          {tok}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1C2030] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => copyDataUrl(asset)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied DataURL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Image URL</span>
                        </>
                      )}
                    </button>

                    {onSetAsScreenshot && (
                      <button
                        type="button"
                        onClick={() => onSetAsScreenshot(asset.imageUrl, asset.name)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Deconstruct this image into design system tokens"
                      >
                        <Layers className="w-3 h-3 text-cyan-400" />
                        <span>Deconstruct</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-Place Image Edit Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0F17] border border-[#23293D] p-6 shadow-2xl">
            <button
              onClick={() => setEditingAsset(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#181C28] hover:bg-[#202538] text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-indigo-400" />
              <h4 className="font-heading text-lg font-bold text-white">
                Edit Asset with gemini-nano-banana-2.1
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-black border border-[#23293D]">
                <img
                  src={editingAsset.imageUrl}
                  alt={editingAsset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between text-xs font-mono space-y-2">
                <div className="p-3 rounded-xl bg-[#11131B] border border-[#1E2333] space-y-1.5">
                  <span className="text-slate-400 uppercase text-[10px]">Original Name:</span>
                  <div className="text-white font-bold">{editingAsset.name}</div>
                  <span className="text-slate-400 uppercase text-[10px] block pt-1">Active Design Tokens:</span>
                  <div className="text-indigo-300 text-[11px] truncate">
                    {system.identity.name} ({system.identity.mode})
                  </div>
                </div>

                <p className="text-slate-400 font-sans text-xs">
                  Your edit instructions will be synthesized with the active design system palette, ensuring brand coherence.
                </p>
              </div>
            </div>

            <form onSubmit={handleEdit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  placeholder="e.g. 'Invert color accents to laser cyan', 'Add sharp geometric faceting'..."
                  className="w-full px-4 py-3 rounded-xl bg-[#090A0F] border border-[#23293D] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              {editError && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300">
                  {editError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-xl bg-[#181C28] hover:bg-[#202538] text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing || !editInstruction.trim()}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    isEditing || !editInstruction.trim()
                      ? 'bg-indigo-950 text-indigo-400/50 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>EDITING WITH NANO BANANA...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>APPLY BRAND EDIT</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxAsset && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxAsset(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxAsset(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxAsset.imageUrl}
              alt={lightboxAsset.name}
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
            <div className="p-3 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>{lightboxAsset.name} ({lightboxAsset.aspectRatio})</span>
              <button
                onClick={() => downloadAsset(lightboxAsset)}
                className="text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
