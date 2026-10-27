import React, { useState } from 'react';
import { Type, Copy, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TypographySystem } from '../types/designSystem';

interface TypographyMatrixViewProps {
  typography: TypographySystem;
}

export const TypographyMatrixView: React.FC<TypographyMatrixViewProps> = ({ typography }) => {
  const [customSample, setCustomSample] = useState('');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyClass = (cssClass: string, name: string) => {
    navigator.clipboard.writeText(cssClass);
    setCopiedStep(name);
    setTimeout(() => setCopiedStep(null), 1800);
  };

  return (
    <div className="space-y-8">
      {/* Font Family Overview Card */}
      <div className="p-6 rounded-2xl bg-[#11131B] border border-[#1E2333]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1E2333]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Type className="w-4 h-4 text-indigo-400" />
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                Typography Scale & Font Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Modular scale ratio: <span className="text-indigo-300 font-semibold">{typography.scaleRatio}</span>
            </p>
          </div>

          {/* Interactive sample text input */}
          <div className="flex items-center gap-2 min-w-[320px]">
            <input
              type="text"
              value={customSample}
              onChange={(e) => setCustomSample(e.target.value)}
              placeholder="Test custom preview text in all scales..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#090A0F] border border-[#23283B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
        </div>

        {/* Font Families Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Primary Sans (Body)
            </span>
            <div className="text-base font-bold text-white mt-1">
              {typography.fontFamilies.sans}
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Systematic legibility, neutral baseline proportions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Display & Titles
            </span>
            <div className="text-base font-bold text-white mt-1">
              {typography.fontFamilies.display}
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Architectural character for high-impact headlines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Monospace & Tabular
            </span>
            <div className="text-base font-bold text-white mt-1">
              {typography.fontFamilies.mono || 'JetBrains Mono'}
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Data density, token hashes, and numerical alignment.
            </p>
          </div>
        </div>
      </div>

      {/* Modular Scale Ladder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
            Typographic Scale Steps
          </h4>
          <span className="text-xs font-mono text-slate-500">
            Click class tag to copy Tailwind class
          </span>
        </div>

        <div className="divide-y divide-[#1B2030] rounded-2xl bg-[#10121A] border border-[#1E2333] overflow-hidden">
          {typography.steps.map((step, idx) => {
            const displayText = customSample || step.sampleText || step.name;
            const isCopied = copiedStep === step.name;

            return (
              <div
                key={`${step.name}-${idx}`}
                className="p-5 hover:bg-[#141724] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Meta details column */}
                <div className="w-full md:w-64 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-heading">
                      {step.name}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-slate-400">
                    <span>
                      Size: <strong className="text-slate-200">{step.size}</strong>
                    </span>
                    <span>
                      LH: <strong className="text-slate-200">{step.lineHeight}</strong>
                    </span>
                    <span>
                      Weight: <strong className="text-slate-200">{step.weight}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyClass(step.cssClass, step.name)}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090A0F] hover:bg-indigo-950/60 text-[11px] font-mono text-indigo-300 border border-[#23283B] hover:border-indigo-600/50 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{step.cssClass}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Visual Live Rendering Column */}
                <div className="flex-1 overflow-hidden">
                  <div
                    style={{
                      fontSize: step.size,
                      lineHeight: step.lineHeight,
                      fontWeight: step.weight,
                      letterSpacing: step.letterSpacing || 'normal',
                    }}
                    className="text-white truncate"
                  >
                    {displayText}
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
