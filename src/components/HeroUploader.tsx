import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Eye, ArrowRight } from 'lucide-react';
import { ScreenshotItem, DesignSystem } from '../types/designSystem';
import { PRESET_SYSTEMS, PresetItem } from '../data/presets';
import { useDialog } from '../hooks/useDialog';

interface HeroUploaderProps {
  screenshots: ScreenshotItem[];
  onAddScreenshot: (item: ScreenshotItem) => void;
  onRemoveScreenshot: (id: string) => void;
  onClearScreenshots: () => void;
  onSynthesize: (brandContext: string) => void;
  onSelectPreset: (preset: PresetItem) => void;
  isAnalyzing: boolean;
  analysisStep: string;
  currentSystem: DesignSystem;
}

export const HeroUploader: React.FC<HeroUploaderProps> = ({
  screenshots,
  onAddScreenshot,
  onRemoveScreenshot,
  onClearScreenshots,
  onSynthesize,
  onSelectPreset,
  isAnalyzing,
  analysisStep,
  currentSystem,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [brandNotes, setBrandNotes] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useDialog<HTMLDivElement>(Boolean(previewModalImg), () =>
    setPreviewModalImg(null)
  );

  useEffect(() => {
    if (!confirmingClear) return;
    const timer = setTimeout(() => setConfirmingClear(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmingClear]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processFile(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onAddScreenshot({
          id: `scr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name || `Screenshot_${new Date().toLocaleTimeString()}`,
          dataUrl: result,
          mimeType: file.type || 'image/png',
          size: file.size,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(processFile);
  };

  const handleFileInput = (files: FileList | null) => {
    handleFiles(files);
    // Reset so choosing the same file again still fires a change event.
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <section className="relative w-full border-b border-[var(--rule)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-16">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="eyebrow">design system deconstruction</div>

            <h1 className="serif mt-5 text-[clamp(2.6rem,5.6vw,4.2rem)] leading-[1.04] tracking-[-0.02em] max-w-[15ch]">
              Read the system inside a screen.
            </h1>

            <p className="mt-6 measure text-[15.5px] leading-[1.75] text-[var(--ink-soft)]">
              Bring one or more screenshots. Syntax returns the colors, the type scale,
              the spacing, and the components. Quietly. All at once.
            </p>

            <p className="mt-4 mono text-[11px] text-[var(--ink-faint)]">
              png, jpg, webp · several screens at once is fine
            </p>
          </div>

          <div className="lg:col-span-4 self-stretch lg:self-end order-3 lg:order-none">
            <div className="eyebrow mb-3">or begin from an archive</div>
            <div className="border-t border-[var(--rule)]">
              {PRESET_SYSTEMS.map((p) => {
                const isSelected = currentSystem.identity.slug === p.system.identity.slug;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPreset(p)}
                    className="w-full flex items-baseline justify-between gap-4 py-3 border-b border-[var(--rule)] text-left group"
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-[13px] transition-colors ${
                          isSelected
                            ? 'text-[var(--lichen)]'
                            : 'text-[var(--ink)] group-hover:text-[var(--ink-soft)]'
                        }`}
                      >
                        {p.system.identity.name.toLowerCase()}
                      </span>
                      <span className="block mono text-[10px] text-[var(--ink-faint)] mt-0.5 truncate">
                        {p.category.toLowerCase()}
                      </span>
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--lichen)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="relative order-2 lg:order-none lg:col-span-12 mt-10 lg:mt-14 rounded-xl border border-dashed p-6 sm:p-10 transition-colors duration-300"
          style={{
            borderColor: isDragging ? 'var(--clay)' : 'var(--rule-strong)',
            backgroundColor: isDragging ? 'rgba(196,112,79,0.035)' : 'transparent',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileInput(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />

          {screenshots.length === 0 ? (
            <div className="max-w-2xl">
              <div className="w-11 h-11 rounded-full border border-[var(--rule-strong)] flex items-center justify-center text-[var(--ink-soft)] mb-5">
                <Upload className="w-4 h-4" />
              </div>
              <h2 className="serif text-[27px] leading-tight">start with a screenshot</h2>
              <p className="mt-2.5 measure text-[14px] leading-[1.7] text-[var(--ink-soft)]">
                Drag one in, paste from the clipboard, or choose a file. Add as many screens
                as you like. Nothing is guessed until you ask.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  choose screenshots
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[12px] text-[var(--ink-faint)]">
                  or press <kbd className="tag py-0.5 px-1.5">ctrl / cmd + v</kbd> anywhere
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="eyebrow">screenshots</span>
                  <span className="mono text-[11px] text-[var(--ink-faint)]">
                    {screenshots.length}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-quiet text-[12px]"
                  >
                    add more
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmingClear) {
                        setConfirmingClear(true);
                        return;
                      }
                      setConfirmingClear(false);
                      onClearScreenshots();
                    }}
                    className={`text-[12px] transition-colors ${
                      confirmingClear
                        ? 'text-[var(--brick)] underline underline-offset-4 decoration-1'
                        : 'text-[var(--ink-faint)] hover:text-[var(--brick)]'
                    }`}
                  >
                    {confirmingClear ? `remove all ${screenshots.length}?` : 'clear all'}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {screenshots.map((s, idx) => (
                  <div
                    key={s.id}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--panel-soft)]"
                  >
                    <img
                      src={s.dataUrl}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[rgba(43,42,40,0.38)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex items-end sm:items-center justify-end sm:justify-center gap-2 p-1.5 sm:p-0">
                      <button
                        type="button"
                        onClick={() => setPreviewModalImg(s.dataUrl)}
                        className="icon-btn"
                        title="view full size"
                        aria-label={`view ${s.name} full size`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveScreenshot(s.id)}
                        className="icon-btn"
                        title="remove"
                        aria-label={`remove ${s.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1.5 left-1.5 mono text-[9px] text-[var(--ink-soft)] bg-[var(--paper)] border border-[var(--rule)] rounded px-1.5 py-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 pt-6 border-t border-[var(--rule)] flex flex-col sm:flex-row sm:items-end gap-4">
                <label className="flex-1">
                  <span className="eyebrow block mb-2">optional direction</span>
                  <input
                    type="text"
                    value={brandNotes}
                    onChange={(e) => setBrandNotes(e.target.value)}
                    placeholder="e.g. editorial and generous, high contrast, warm light"
                    className="input"
                  />
                </label>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => onSynthesize(brandNotes)}
                  className="btn-primary sm:mb-[1px] shrink-0"
                >
                  {isAnalyzing ? (
                    <span>{analysisStep || 'reading the screen'}</span>
                  ) : (
                    <>
                      <span>synthesize the system</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {isAnalyzing && (
                <p className="mt-3 text-[12px] text-[var(--ink-faint)]">
                  this takes a moment. you can keep the tab open.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

        {previewModalImg && (
          <div className="fixed inset-0 z-50 scrim flex items-center justify-center p-4 sm:p-8"
            onClick={() => setPreviewModalImg(null)}
          >
            <div
              ref={previewRef}
              role="dialog"
              aria-modal="true"
              aria-label="screenshot preview"
              className="relative max-w-4xl max-h-[90vh] card p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="absolute top-3 right-3 icon-btn z-10"
                title="close"
                aria-label="close the preview"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={previewModalImg}
                alt="Enlarged screenshot preview"
                className="max-h-[84vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
