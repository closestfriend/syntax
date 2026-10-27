import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, AlertTriangle, Layers, Palette } from 'lucide-react';
import { ColorArchitecture, ColorToken } from '../types/designSystem';

interface ColorTokensViewProps {
  colors: ColorArchitecture;
}

export const ColorTokensView: React.FC<ColorTokensViewProps> = ({ colors }) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const categories = ['all', 'surface', 'brand', 'accent', 'neutral', 'semantic'];

  const filteredPalette = colors.palette.filter((c) => {
    if (filterCategory === 'all') return true;
    return c.category?.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Surface Architecture Bar */}
      <div className="p-5 rounded-2xl bg-[#11131B] border border-[#1E2333]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="font-heading text-sm font-bold tracking-tight text-white uppercase">
              Semantic Surface & Canvas Hierarchy
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Luminance Stepping Architecture
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            { label: 'Root Canvas', hex: colors.surfaces.canvas, desc: 'Backdrop ground' },
            { label: 'Surface Low', hex: colors.surfaces.surface, desc: 'Card containers' },
            { label: 'Surface Elevated', hex: colors.surfaces.elevated, desc: 'Modals / popovers' },
            { label: 'Border Line', hex: colors.surfaces.border, desc: 'Boundary strokes' },
            { label: 'Text Primary', hex: colors.surfaces.textPrimary, desc: 'Headlines & body' },
            { label: 'Text Secondary', hex: colors.surfaces.textSecondary, desc: 'Captions & meta' },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => copyToClipboard(s.hex, s.label)}
              className="p-3 rounded-xl bg-[#090A0F] border border-[#202538] hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                  style={{ backgroundColor: s.hex }}
                />
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">
                  {copiedToken === s.label ? 'COPIED' : 'HEX'}
                </span>
              </div>
              <div className="text-xs font-semibold text-white truncate">{s.label}</div>
              <div className="text-[11px] font-mono text-indigo-300 mt-0.5">{s.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Palette Tokens Grid */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-white tracking-tight">
              Color Token Palette
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Tokens extracted directly from screenshot pixels with WCAG contrast ratings.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#11131B] border border-[#1E2333]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPalette.map((token, idx) => {
            const isCopied = copiedToken === token.name;
            return (
              <div
                key={`${token.name}-${idx}`}
                className="group relative p-4 rounded-xl bg-[#10121A] border border-[#1E2436] hover:border-indigo-500/50 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Swatch Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border border-white/20 shadow-inner shrink-0"
                        style={{ backgroundColor: token.hex }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">
                          {token.name}
                        </h4>
                        <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-[#181C28] text-slate-400 border border-[#23283B]">
                          {token.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(token.hex, token.name)}
                      className="p-1.5 rounded-lg bg-[#181C28] hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-200 transition-colors cursor-pointer"
                      title="Copy Hex"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Token Details */}
                  <div className="space-y-1.5 text-xs font-mono bg-[#090A0F] p-3 rounded-lg border border-[#191D2B]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>HEX:</span>
                      <span className="text-white font-semibold">{token.hex}</span>
                    </div>
                    {token.rgb && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>RGB:</span>
                        <span className="text-slate-200">{token.rgb}</span>
                      </div>
                    )}
                    {token.hsl && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>HSL:</span>
                        <span className="text-slate-300">{token.hsl}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-[#191D2B]">
                      <span>FIGMA:</span>
                      <span className="text-indigo-300 text-[10px] truncate max-w-[140px]">
                        {token.figmaTokenPath}
                      </span>
                    </div>
                  </div>

                  {/* Role explanation */}
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
                    {token.role}
                  </p>
                </div>

                {/* WCAG Compliance Footer */}
                <div className="mt-4 pt-3 border-t border-[#1C2030] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">WCAG Contrast:</span>
                  <div className="flex items-center gap-1.5">
                    {token.wcagPass ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{token.contrastRatio || 'PASS'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{token.contrastRatio || 'LARGE ONLY'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
