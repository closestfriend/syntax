import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DesignComponent, DesignSystem } from '../types/designSystem';

interface InteractiveComponentPreviewProps {
  component: DesignComponent;
  system: DesignSystem;
}

export const InteractiveComponentPreview: React.FC<InteractiveComponentPreviewProps> = ({
  component,
  system,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'vue' | 'html' | 'figma'>('react');
  const [copied, setCopied] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [testInput, setTestInput] = useState('');
  const [toggleState, setToggleState] = useState(false);

  const copyActiveCode = () => {
    let text = component.reactCode;
    if (activeCodeTab === 'vue') text = component.vueCode;
    if (activeCodeTab === 'html') text = component.htmlCode || component.reactCode;
    if (activeCodeTab === 'figma') text = component.figmaTokens || `// Token path: ${component.id}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLiveSandbox = () => {
    const id = component.id.toLowerCase();
    const name = component.name.toLowerCase();

    if (id.includes('btn') || name.includes('button') || name.includes('trigger')) {
      const isBrutalist = system.identity.slug === 'acid-brutalism' || id.includes('brutal');
      const isEditorial = system.identity.slug === 'helvetic-editorial';

      if (isBrutalist) {
        return (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setClickCount((c) => c + 1)}
              className="inline-flex items-center gap-3 px-5 py-2.5 border border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] mono text-[11px] uppercase tracking-[0.08em] hover:bg-[var(--ground)] transition-colors duration-300"
            >
              <span>{component.name}</span>
              <span className="text-[var(--ink-faint)]">[{clickCount}]</span>
            </button>
            <span className="mono text-[10px] text-[var(--ink-faint)]">
              clicked {clickCount} times
            </span>
          </div>
        );
      }

      if (isEditorial) {
        return (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setClickCount((c) => c + 1)}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-[3px] bg-[var(--ink)] text-[var(--ground)] serif text-[14px] tracking-wide hover:bg-[var(--clay)] transition-colors duration-300 border border-[var(--ink)]"
            >
              <span>{component.name}</span>
              <span className="mono text-[10px]">→ {clickCount}</span>
            </button>
            <span className="mono text-[10px] text-[var(--ink-faint)]">
              trigger count {clickCount}
            </span>
          </div>
        );
      }

      if (system.identity.slug === 'overcast-room') {
        return (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setClickCount((c) => c + 1)}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--clay-deep)] px-4 py-2.5 text-[13px] text-[#fbf8f4] hover:bg-[var(--clay-press)] transition-colors duration-300"
            >
              <span>
                {component.props?.find((p) => p.name === 'label')?.default ??
                  component.name.toLowerCase()}
              </span>
              <span aria-hidden>→</span>
            </button>
            {clickCount > 0 && (
              <span className="mono text-[10px] text-[var(--ink-faint)]">
                pressed {clickCount} times
              </span>
            )}
          </div>
        );
      }

      return (
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setClickCount((c) => c + 1)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-[10px] bg-[var(--clay-deep)] text-[#fbf8f4] text-[13px] hover:bg-[var(--clay-press)] transition-colors duration-300"
          >
            <span>{component.name}</span>
            <span className="mono text-[10px] bg-[rgba(251,248,244,0.18)] px-1.5 py-0.5 rounded">
              {clickCount}
            </span>
          </button>
          <span className="mono text-[10px] text-[var(--ink-faint)]">
            press it as often as you like
          </span>
        </div>
      );
    }

    if (id.includes('metric') || id.includes('card') || name.includes('card') || name.includes('hud')) {
      const isBrutalist = system.identity.slug === 'acid-brutalism';

      if (isBrutalist) {
        return (
          <div className="max-w-md p-5 bg-[var(--paper)] border border-[var(--ink)] text-[var(--ink)]">
            <div className="mono text-[10px] tracking-[0.08em] text-[var(--ink-faint)] mb-1">
              telemetry / live
            </div>
            <h4 className="serif text-[19px]">{component.name}</h4>
            <div className="serif text-[28px] mt-2">
              {(94.8 + clickCount * 0.4).toFixed(1)}% efficiency
            </div>
          </div>
        );
      }

      if (system.identity.slug === 'overcast-room') {
        return (
          <article className="max-w-md w-full p-6 card">
            <div className="flex items-center justify-between gap-4">
              <span className="eyebrow">reading note</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lichen)]" />
            </div>
            <h4 className="serif text-[23px] leading-tight mt-2.5 text-[var(--ink)]">
              {component.name}
            </h4>
            <p className="mt-2 text-[13px] leading-[1.7] text-[var(--ink-soft)]">
              {component.description}
            </p>
          </article>
        );
      }

      return (
        <div
          onClick={() => setClickCount((c) => c + 1)}
          className="max-w-md w-full p-5 card hover:border-[var(--rule-strong)] transition-colors duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow">{component.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lichen)]" />
          </div>
          <div className="serif text-[28px] leading-none text-[var(--ink)]">
            {(1420 + clickCount * 18).toLocaleString()} ms
          </div>
          <div className="mt-2 flex items-center gap-2 mono text-[10px] text-[var(--lichen)]">
            <span>+14.2% synchronized</span>
            <span className="text-[var(--ink-faint)]">· click to simulate load</span>
          </div>
        </div>
      );
    }

    if (id.includes('input') || id.includes('command') || name.includes('input') || name.includes('field')) {
      return (
        <div className="max-w-md relative flex items-center w-full">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="type here to test focus and type"
            className="input pr-16"
          />
          <div className="absolute right-3 tag py-0.5 px-1.5">⌘K</div>
        </div>
      );
    }

    if (id.includes('badge') || id.includes('pill') || name.includes('badge')) {
      return (
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="tag">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lichen)]" />
            active · wcag aa
          </span>
          <span className="tag">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-faint)]" />
            agent integrated
          </span>
          <span className="tag">tokens synced</span>
        </div>
      );
    }

    return (
      <div className="p-4 card max-w-lg">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h5 className="serif text-[17px]">{component.name}</h5>
          <button
            onClick={() => setToggleState(!toggleState)}
            className={`tag transition-colors ${
              toggleState
                ? 'border-[var(--lichen)] text-[var(--lichen)]'
                : 'hover:border-[var(--ink-faint)]'
            }`}
          >
            {toggleState ? 'active' : 'toggle state'}
          </button>
        </div>
        <p className="text-[12.5px] leading-[1.7] text-[var(--ink-soft)]">
          {component.description}
        </p>
      </div>
    );
  };

  const codeTabs = [
    { id: 'react', label: 'react' },
    { id: 'vue', label: 'vue' },
    { id: 'html', label: 'html' },
    { id: 'figma', label: 'figma dtcg' },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-[var(--rule)] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="serif text-[21px] leading-tight">{component.name}</h3>
            <span className="tag">{component.category.toLowerCase()}</span>
          </div>
          <p className="text-[12.5px] leading-[1.65] text-[var(--ink-soft)] mt-1.5">
            {component.description}
          </p>
        </div>

        <button
          type="button"
          onClick={copyActiveCode}
          className="btn-secondary self-start text-[12px] shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--lichen)]" />
              <span className="text-[var(--lichen)]">copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>copy {activeCodeTab}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 sm:p-8 border-b border-[var(--rule)] bg-[var(--ground-deep)]">
        <div className="flex items-center justify-between mb-5">
          <span className="eyebrow">live instance</span>
          <span className="mono text-[10px] text-[var(--ink-faint)]">tokens applied</span>
        </div>

        <div className="w-full flex items-center justify-center py-3">
          {renderLiveSandbox()}
        </div>
      </div>

      <div className="px-5 pt-3 border-b border-[var(--rule)] flex items-center justify-between gap-4 bg-[var(--paper)]">
        <div className="flex items-center gap-5 overflow-x-auto quiet-scroll">
          {codeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id as any)}
              className="tab-link text-[12px]"
              data-active={activeCodeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="hidden sm:inline mono text-[9.5px] text-[var(--ink-faint)]">
          production-ready
        </span>
      </div>

      <div className="p-5 bg-[var(--ground-deep)] border-b border-[var(--rule)] max-h-72 overflow-y-auto overflow-x-auto quiet-scroll">
        <pre className="mono text-[11px] leading-[1.7] text-[var(--ink-soft)]">
          {activeCodeTab === 'react' && component.reactCode}
          {activeCodeTab === 'vue' && component.vueCode}
          {activeCodeTab === 'html' && (component.htmlCode || component.reactCode)}
          {activeCodeTab === 'figma' &&
            (component.figmaTokens ||
              `// dtcg token reference\n{\n  "$type": "component",\n  "$name": "${component.name}",\n  "$path": "${component.id}"\n}`)}
        </pre>
      </div>

      {component.props && component.props.length > 0 && (
        <div className="p-5 bg-[var(--paper)]">
          <span className="eyebrow block mb-3">component api</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {component.props.map((p) => (
              <div key={p.name} className="sunken p-3 mono text-[10.5px]">
                <div className="text-[var(--ink)]">{p.name}</div>
                <div className="text-[var(--ink-faint)] mt-0.5">
                  type <span className="text-[var(--ink-soft)]">{p.type}</span>
                </div>
                {p.default && (
                  <div className="text-[var(--ink-faint)] mt-0.5">default {p.default}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
