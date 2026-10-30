import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Wand2,
  Download,
  Copy,
  Check,
  X,
  Layers,
  Maximize2,
  ArrowRight,
} from 'lucide-react';
import { DesignSystem, GeneratedAsset } from '../types/designSystem';
import { generateDesignAssetApi, editDesignAssetApi } from '../services/api';
import { useDialog } from '../hooks/useDialog';

interface ImageAssetStudioProps {
  system: DesignSystem;
  assets: GeneratedAsset[];
  onAddAsset: (asset: GeneratedAsset) => void;
  onUpdateAsset: (asset: GeneratedAsset) => void;
  onSetAsScreenshot?: (dataUrl: string, name: string) => void;
  onEngineActivity?: () => void;
}

export const ImageAssetStudio: React.FC<ImageAssetStudioProps> = ({
  system,
  assets,
  onAddAsset,
  onUpdateAsset,
  onSetAsScreenshot,
  onEngineActivity,
}) => {
  const [prompt, setPrompt] = useState('');
  const [assetType, setAssetType] = useState<string>('ui-artifact');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [imageSize, setImageSize] = useState<string>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [editingAsset, setEditingAsset] = useState<GeneratedAsset | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [lightboxAsset, setLightboxAsset] = useState<GeneratedAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const editPanelRef = useDialog<HTMLDivElement>(Boolean(editingAsset), () => setEditingAsset(null));
  const lightboxRef = useDialog<HTMLDivElement>(Boolean(lightboxAsset), () => setLightboxAsset(null));

  const sampleSuggestions = [
    { label: 'a quiet monogram', type: 'badge-icon' },
    { label: 'soft paper texture', type: 'texture-pattern' },
    { label: 'a horizon for the hero', type: 'hero-visual' },
    { label: 'an editorial still life', type: 'editorial-still' },
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
      setGenerationError(
        err.message || 'the image could not be rendered. check the api connection and try again.'
      );
    } finally {
      setIsGenerating(false);
      onEngineActivity?.();
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
      setEditError(err.message || 'the edit could not be applied. try again in a moment.');
    } finally {
      setIsEditing(false);
      onEngineActivity?.();
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
    <div className="space-y-14">
      <section className="max-w-3xl">
        <div className="eyebrow">visual studio</div>
        <h2 className="serif text-[2rem] sm:text-[2.5rem] leading-[1.12] mt-4">
          Make an image that belongs here.
        </h2>
        <p className="measure mt-4 text-[14px] leading-[1.75] text-[var(--ink-soft)]">
          Describe what you want in your own words. The prompt is rewritten to hold the
          palette and mood of <span className="text-[var(--ink)]">{system.identity.name}</span>,
          then rendered.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="tag">gemini nano banana 2.1</span>
          <span className="tag">token-constrained</span>
        </div>

        <form onSubmit={handleGenerate} className="mt-7">
          <label className="block">
            <span className="eyebrow block mb-2">the prompt</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. a soft graphite horizon, one clay mark, no shadow"
              className="input"
              aria-label="describe the image to generate"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="select"
                aria-label="asset type"
                title="asset type"
              >
                <option value="ui-artifact">3d ui artifact</option>
                <option value="hero-visual">hero key visual</option>
                <option value="badge-icon">monogram / badge</option>
                <option value="texture-pattern">texture & wallpaper</option>
                <option value="editorial-still">editorial still</option>
              </select>

              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="select"
                aria-label="aspect ratio"
                title="aspect ratio"
              >
                <option value="1:1">1:1 square</option>
                <option value="16:9">16:9 landscape</option>
                <option value="9:16">9:16 portrait</option>
                <option value="4:3">4:3 standard</option>
                <option value="3:4">3:4 poster</option>
                <option value="1:4">1:4 header</option>
                <option value="4:1">4:1 ribbon</option>
              </select>

              <div
                className="flex items-center rounded-[9px] border border-[var(--rule-strong)] p-0.5"
                role="group"
                aria-label="image size"
              >
                {(['1K', '2K'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    aria-pressed={imageSize === sz}
                    className={`px-2.5 py-1 rounded-[7px] mono text-[10.5px] transition-colors duration-300 ${
                      imageSize === sz
                        ? 'bg-[var(--ink)] text-[var(--ground)]'
                        : 'text-[var(--ink-faint)] hover:text-[var(--ink-soft)]'
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
              className="btn-primary shrink-0"
            >
              {isGenerating ? (
                <span>rendering</span>
              ) : (
                <>
                  <span>generate asset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">try</span>
          {sampleSuggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setPrompt(s.label);
                setAssetType(s.type);
              }}
              className="tag hover:border-[var(--ink-faint)] hover:text-[var(--ink-soft)] transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {generationError && (
          <p className="mt-5 pl-3 border-l-2 border-[var(--brick)] text-[12.5px] text-[var(--brick)] leading-relaxed">
            {generationError}
          </p>
        )}
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="eyebrow">catalog</div>
            <h4 className="serif text-[24px] mt-2">
              rendered assets{' '}
              <span className="mono text-[12px] text-[var(--ink-faint)] align-middle">
                {assets.length}
              </span>
            </h4>
          </div>
          <p className="text-[12px] text-[var(--ink-faint)] max-w-xs sm:text-right">
            each image keeps the palette it was made from.
          </p>
        </div>

        {assets.length === 0 ? (
          <div className="mt-6 pt-8 border-t border-[var(--rule)] max-w-xl">
            <div className="w-10 h-10 rounded-full border border-[var(--rule-strong)] flex items-center justify-center text-[var(--ink-soft)] mb-4">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h4 className="serif text-[23px]">Nothing rendered yet.</h4>
            <p className="mt-2 text-[13.5px] leading-[1.7] text-[var(--ink-soft)]">
              Write a prompt above. Renders stay in this tab — download one to keep it.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="card overflow-hidden flex flex-col group">
                <div
                  className="relative w-full bg-[var(--panel-soft)] overflow-hidden"
                  style={{ aspectRatio: asset.aspectRatio.replace(':', ' / ') }}
                >
                  <img
                    src={asset.imageUrl}
                    alt={asset.name}
                    className={`w-full h-full ${
                      asset.aspectRatio === '1:1' ? 'object-cover' : 'object-contain'
                    }`}
                  />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className="tag"
                      style={{ backgroundColor: 'var(--paper)' }}
                    >
                      {asset.aspectRatio} · {asset.imageSize}
                    </span>
                    <span
                      className="tag hidden sm:inline-flex"
                      style={{ backgroundColor: 'var(--paper)' }}
                    >
                      {asset.assetType}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-[rgba(43,42,40,0.32)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex items-end sm:items-center justify-end sm:justify-center gap-2 p-3 sm:p-4">
                    <button
                      type="button"
                      onClick={() => setLightboxAsset(asset)}
                      className="icon-btn"
                      title="enlarge"
                      aria-label={`enlarge ${asset.name}`}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAsset(asset);
                        setEditInstruction('');
                      }}
                      className="icon-btn"
                      title="edit with ai"
                      aria-label={`edit ${asset.name} with ai`}
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadAsset(asset)}
                      className="icon-btn"
                      title="download png"
                      aria-label={`download ${asset.name}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h5 className="serif text-[18px] leading-snug truncate">{asset.name}</h5>
                  <p className="mono text-[10px] text-[var(--ink-faint)] mt-1 truncate">
                    “{asset.originalPrompt}”
                  </p>

                  <div className="sunken mt-3 p-3">
                    <div className="eyebrow mb-1">tokens enforced</div>
                    <p className="text-[11.5px] leading-[1.65] text-[var(--ink-soft)]">
                      {asset.designSystemAlignment}
                    </p>
                  </div>

                  {asset.appliedTokens && asset.appliedTokens.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {asset.appliedTokens.slice(0, 3).map((tok, i) => (
                        <span key={i} className="tag">
                          {tok}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-[var(--rule)] mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => copyDataUrl(asset)}
                      className="flex items-center gap-1.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--lichen)]" />
                          <span className="text-[var(--lichen)]">copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>copy url</span>
                        </>
                      )}
                    </button>

                    {onSetAsScreenshot && (
                      <button
                        type="button"
                        onClick={() => onSetAsScreenshot(asset.imageUrl, asset.name)}
                        className="flex items-center gap-1.5 text-[var(--ink-faint)] hover:text-[var(--ink-soft)] transition-colors"
                        title="deconstruct this image into tokens"
                      >
                        <Layers className="w-3 h-3" />
                        <span>deconstruct</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingAsset && (
        <div className="fixed inset-0 z-50 scrim flex items-center justify-center p-4 sm:p-8">
          <div
            ref={editPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="edit this image"
            className="relative w-full max-w-2xl card p-6 sm:p-7"
          >
            <button
              onClick={() => setEditingAsset(null)}
              className="absolute top-4 right-4 icon-btn"
              title="close"
              aria-label="close the edit panel"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="serif text-[23px] pr-10">Edit this image</h4>
            <p className="text-[12.5px] text-[var(--ink-soft)] mt-1">
              Your instruction is held against the active palette.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-[var(--panel-soft)] border border-[var(--rule)]">
                <img
                  src={editingAsset.imageUrl}
                  alt={editingAsset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="sunken p-3.5">
                  <div className="eyebrow">original</div>
                  <div className="serif text-[17px] mt-1">{editingAsset.name}</div>
                  <div className="eyebrow mt-3">active system</div>
                  <div className="text-[12px] text-[var(--ink-soft)] mt-1">
                    {system.identity.name} · {system.identity.mode}
                  </div>
                </div>

                <p className="text-[12px] leading-[1.7] text-[var(--ink-soft)]">
                  Keep the change small. The closer the instruction, the quieter the result.
                </p>
              </div>
            </div>

            <form onSubmit={handleEdit} className="mt-5 space-y-3">
              <input
                type="text"
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                placeholder="e.g. lower the contrast, remove the background, warm the light"
                className="input"
              />

              {editError && (
                <p className="pl-3 border-l-2 border-[var(--brick)] text-[12px] text-[var(--brick)]">
                  {editError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="btn-quiet"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing || !editInstruction.trim()}
                  className="btn-primary"
                >
                  {isEditing ? <span>applying</span> : <span>apply the edit</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lightboxAsset && (
        <div
          className="fixed inset-0 z-50 scrim flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxAsset(null)}
        >
          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`image preview: ${lightboxAsset.name}`}
            className="relative max-w-4xl max-h-[90vh] card p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxAsset(null)}
              className="absolute top-3 right-3 icon-btn z-10"
              title="close"
              aria-label="close the preview"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightboxAsset.imageUrl}
              alt={lightboxAsset.name}
              className="max-h-[78vh] w-auto object-contain rounded-lg"
            />
            <div className="px-2 py-3 flex items-center justify-between gap-4 text-[11px] mono text-[var(--ink-soft)]">
              <span>
                {lightboxAsset.name} · {lightboxAsset.aspectRatio}
              </span>
              <button
                onClick={() => downloadAsset(lightboxAsset)}
                className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>download png</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
