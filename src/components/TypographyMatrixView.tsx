import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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

  const families = [
    {
      label: 'primary sans',
      name: typography.fontFamilies.sans,
      note: 'interface text and body copy',
    },
    {
      label: 'display',
      name: typography.fontFamilies.display,
      note: 'titles and moments of emphasis',
    },
    {
      label: 'monospace',
      name: typography.fontFamilies.mono || 'system mono',
      note: 'token paths and tabular data',
    },
  ];

  return (
    <div className="space-y-14">
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="eyebrow">typography</div>
            <h3 className="serif text-[25px] mt-2">the reading voice</h3>
            <p className="text-[12.5px] text-[var(--ink-soft)] mt-1">
              modular scale · <span className="mono text-[11px]">{typography.scaleRatio}</span>
            </p>
          </div>

          <label className="w-full md:w-80">
            <span className="eyebrow block mb-2">preview text</span>
            <input
              type="text"
              value={customSample}
              onChange={(e) => setCustomSample(e.target.value)}
              placeholder="try a line of your own"
              className="input"
            />
          </label>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-[var(--rule)] pt-6">
          {families.map((f) => (
            <div key={f.label}>
              <div className="eyebrow">{f.label}</div>
              <div className="text-[16px] font-medium mt-2 leading-tight">{f.name}</div>
              <p className="text-[12px] text-[var(--ink-faint)] mt-1.5">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div className="eyebrow">scale steps</div>
          <span className="text-[11px] text-[var(--ink-faint)]">
            click a class to copy it
          </span>
        </div>

        <div className="mt-4 border-t border-[var(--rule)]">
          {typography.steps.map((step, idx) => {
            const displayText = customSample || step.sampleText || step.name;
            const isCopied = copiedStep === step.name;
            const usesDisplay =
              /display|heading|subhead|title|quote/i.test(step.name) ||
              parseFloat(step.size) >= 30;
            const usesMono = /mono|caption|code/i.test(step.name);

            return (
              <div
                key={`${step.name}-${idx}`}
                className="py-6 border-b border-[var(--rule)] grid grid-cols-1 md:grid-cols-[15rem_1fr] gap-4 md:gap-8 md:items-center"
              >
                <div>
                  <div className="text-[13px] text-[var(--ink)]">{step.name}</div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 mono text-[10.5px] text-[var(--ink-faint)]">
                    <span>size {step.size}</span>
                    <span>lh {step.lineHeight}</span>
                    <span>weight {step.weight}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyClass(step.cssClass, step.name)}
                    className="tag mt-2.5 hover:border-[var(--ink-faint)] hover:text-[var(--ink-soft)] transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[var(--lichen)]" />
                        <span className="text-[var(--lichen)]">copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="truncate max-w-[170px]">{step.cssClass}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="overflow-hidden">
                  <div
                    style={{
                      fontSize: step.size,
                      lineHeight: step.lineHeight,
                      fontWeight: step.weight,
                      letterSpacing: step.letterSpacing || 'normal',
                      fontFamily: usesMono
                        ? typography.fontFamilies.mono
                        : usesDisplay
                        ? typography.fontFamilies.display
                        : typography.fontFamilies.sans,
                    }}
                    className="text-[var(--ink)] truncate"
                  >
                    {displayText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
