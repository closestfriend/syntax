import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ColorArchitecture } from '../types/designSystem';
import { contrastRatio, formatRatio, wcagVerdict, verdictLabel } from '../utils/contrast';

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

  const categories = ['all', ...Array.from(new Set(colors.palette.map((c) => c.category?.toLowerCase()).filter(Boolean)))];

  const filteredPalette = colors.palette.filter((c) => {
    if (filterCategory === 'all') return true;
    return c.category?.toLowerCase() === filterCategory.toLowerCase();
  });

  const surfaces = [
    { label: 'root canvas', hex: colors.surfaces.canvas, desc: 'backdrop ground' },
    { label: 'surface low', hex: colors.surfaces.surface, desc: 'card containers' },
    { label: 'surface elevated', hex: colors.surfaces.elevated, desc: 'modals and popovers' },
    { label: 'border line', hex: colors.surfaces.border, desc: 'boundary strokes' },
    { label: 'text primary', hex: colors.surfaces.textPrimary, desc: 'headlines and body' },
    { label: 'text secondary', hex: colors.surfaces.textSecondary, desc: 'captions and meta' },
  ];

  const canvas = colors.surfaces.canvas;

  return (
    <div className="space-y-14">
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="eyebrow">surface hierarchy</div>
            <h3 className="serif text-[25px] mt-2">how the room is built</h3>
          </div>
          <p className="text-[12px] text-[var(--ink-faint)]">
            luminance stepping, not shadow. click a surface to copy.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--rule)] border border-[var(--rule)] rounded-xl overflow-hidden">
          {surfaces.map((s) => (
            <button
              key={s.label}
              onClick={() => copyToClipboard(s.hex, s.label)}
              className="bg-[var(--ground)] hover:bg-[var(--paper)] p-4 text-left transition-colors duration-300"
            >
              <div
                className="w-7 h-7 rounded-md border border-[var(--rule-strong)]"
                style={{ backgroundColor: s.hex }}
              />
              <div className="mt-3 text-[12px] text-[var(--ink)]">{s.label}</div>
              <div className="mono text-[10px] text-[var(--ink-faint)] mt-0.5">
                {copiedToken === s.label ? 'copied' : s.hex}
              </div>
              <div className="text-[10.5px] text-[var(--ink-faint)] mt-1">{s.desc}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="eyebrow">palette</div>
            <h3 className="serif text-[25px] mt-2">color tokens</h3>
            <p className="text-[12.5px] text-[var(--ink-soft)] mt-1">
              contrast is measured against the canvas, not asserted.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {categories.map((cat) => {
              const active = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`pb-1 border-b text-[12px] transition-colors duration-300 ${
                    active
                      ? 'text-[var(--lichen)] border-[var(--lichen)]'
                      : 'text-[var(--ink-faint)] border-transparent hover:text-[var(--ink-soft)]'
                  }`}
                >
                  {cat.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPalette.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-4 pt-4">
              <h4 className="serif text-[22px]">No {filterCategory} tokens here.</h4>
              <p className="mt-2 text-[13px] leading-[1.7] text-[var(--ink-soft)] max-w-md">
                This system does not include that category. Pick another filter, or go back to
                the whole palette.
              </p>
            </div>
          )}
          {filteredPalette.map((token, idx) => {
            const isCopied = copiedToken === token.name;
            const ratio = contrastRatio(token.hex, canvas);
            const verdict = wcagVerdict(ratio);
            const isSurface = token.category?.toLowerCase() === 'surface';
            const isFill = token.category?.toLowerCase() === 'accent';
            return (
              <div
                key={`${token.name}-${idx}`}
                className="card p-4 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg border border-[var(--rule-strong)] shrink-0"
                      style={{ backgroundColor: token.hex }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-[13px] leading-snug truncate">{token.name}</h4>
                      <span className="mono text-[10px] text-[var(--ink-faint)] lowercase">
                        {token.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(token.hex, token.name)}
                    className="text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors shrink-0"
                    title="copy hex"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-[var(--lichen)]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--rule)] space-y-1.5 mono text-[10.5px]">
                  <div className="flex items-center justify-between gap-3 text-[var(--ink-faint)]">
                    <span>hex</span>
                    <span className="text-[var(--ink)]">{token.hex}</span>
                  </div>
                  {token.rgb && (
                    <div className="flex items-center justify-between gap-3 text-[var(--ink-faint)]">
                      <span>rgb</span>
                      <span className="text-[var(--ink-soft)] truncate">{token.rgb}</span>
                    </div>
                  )}
                  {token.hsl && (
                    <div className="flex items-center justify-between gap-3 text-[var(--ink-faint)]">
                      <span>hsl</span>
                      <span className="text-[var(--ink-soft)] truncate">{token.hsl}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3 text-[var(--ink-faint)]">
                    <span>figma</span>
                    <span className="text-[var(--ink-soft)] text-[9.5px] truncate max-w-[140px]">
                      {token.figmaTokenPath}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[12px] leading-[1.65] text-[var(--ink-soft)]">
                  {token.role}
                </p>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2 text-[10.5px] mono whitespace-nowrap">
                  <span className="text-[var(--ink-faint)]">
                    {isSurface ? 'step' : 'on canvas'}
                  </span>
                  {isSurface ? (
                    <span className="text-[var(--ink-faint)]">
                      {formatRatio(ratio)} from canvas
                    </span>
                  ) : isFill ? (
                    <span className="flex items-center gap-1.5 text-[var(--ochre)]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{formatRatio(ratio)} · fill, not text</span>
                    </span>
                  ) : verdict === 'fail' ? (
                    <span className="flex items-center gap-1.5 text-[var(--brick)]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {formatRatio(ratio)} · {verdictLabel(verdict)}
                      </span>
                    </span>
                  ) : (
                    <span
                      className={`flex items-center gap-1.5 ${
                        verdict === 'pass' ? 'text-[var(--lichen)]' : 'text-[var(--ochre)]'
                      }`}
                    >
                      {verdict === 'pass' ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {formatRatio(ratio)} · {verdictLabel(verdict)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
