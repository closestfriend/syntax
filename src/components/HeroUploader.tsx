import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Layers, 
  ArrowRight,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { ScreenshotItem, DesignSystem } from '../types/designSystem';
import { PRESET_SYSTEMS, PresetItem } from '../data/presets';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler so the user can just hit Ctrl+V anywhere
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <section className="relative w-full border-b border-[#1E2333] bg-gradient-to-b from-[#0B0D14] to-[#090A0F] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Headline Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-[11px] font-mono text-indigo-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>MULTIMODAL GEMINI DECONSTRUCTION ENGINE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              REVERSE-ENGINEER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">
                DESIGN SYSTEMS
              </span>
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl font-sans">
              Drop UI screenshots from any application or website. Extract production tokens, 
              typography scales, WCAG matrices, and reusable React & Vue component libraries.
            </p>
          </div>

          {/* Quick Presets Selector */}
          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Or explore curated archives:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_SYSTEMS.map((p) => {
                const isSelected = currentSystem.identity.slug === p.system.identity.slug;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-[#121520] hover:bg-[#1A1F30] text-slate-300 border-[#22283A]'
                    }`}
                  >
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upload Zone Card */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 transition-all p-6 sm:p-8 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_30px_rgba(99,102,241,0.25)]'
              : 'border-dashed border-[#23293D] hover:border-slate-600 bg-[#0E1017]/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />

          {screenshots.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white font-heading">
                Drag & Drop UI Screenshots or Paste from Clipboard
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-md">
                Paste directly anywhere with <kbd className="px-1.5 py-0.5 rounded bg-[#1A1E2B] text-slate-300 border border-[#2B3247]">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#1A1E2B] text-slate-300 border border-[#2B3247]">Cmd+V</kbd> or choose image files (PNG, JPG, WEBP).
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold font-mono tracking-wide transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer"
                >
                  SELECT SCREENSHOT FILES
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>• Supports multi-screen sets (e.g. Nav + Card + Modal)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Populated State with Screenshot Strip */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Screenshots Loaded:
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-800">
                    {screenshots.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                  >
                    + Add More Images
                  </button>
                  <button
                    type="button"
                    onClick={onClearScreenshots}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Thumbnails grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {screenshots.map((s, idx) => (
                  <div
                    key={s.id}
                    className="group relative rounded-xl overflow-hidden border border-[#23293D] bg-[#121520] aspect-video flex items-center justify-center shadow-md"
                  >
                    <img
                      src={s.dataUrl}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewModalImg(s.dataUrl)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white cursor-pointer"
                        title="View Fullsize"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveScreenshot(s.id)}
                        className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Brand guidance input + Synthesize trigger bar */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2 border-t border-[#1B2030]">
                <div className="relative flex-1">
                  <Sliders className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={brandNotes}
                    onChange={(e) => setBrandNotes(e.target.value)}
                    placeholder="Optional brand notes: e.g., 'Modern fintech dark mode with high WCAG contrast', 'Luxury Swiss magazine'..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121520] border border-[#23293D] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => onSynthesize(brandNotes)}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    isAnalyzing
                      ? 'bg-indigo-950 text-indigo-400 border border-indigo-700 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      <span>{analysisStep || 'SYNTHESIZING...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>SYNTHESIZE DESIGN SYSTEM</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fullsize image preview modal */}
        {previewModalImg && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreviewModalImg(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 p-2">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewModalImg}
                alt="Enlarged screenshot preview"
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
