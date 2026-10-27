import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Code2, 
  Eye, 
  Sparkles, 
  Layers, 
  Play, 
  SlidersHorizontal,
  FileCode,
  Terminal
} from 'lucide-react';
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

  /**
   * Safe live sandbox rendering for the component using system styling tokens
   */
  const renderLiveSandbox = () => {
    const id = component.id.toLowerCase();
    const name = component.name.toLowerCase();

    // 1. Kinetic Primary Button
    if (id.includes('btn') || name.includes('button') || name.includes('trigger')) {
      const isBrutalist = system.identity.slug === 'acid-brutalism' || id.includes('brutal');
      const isEditorial = system.identity.slug === 'helvetic-editorial';

      if (isBrutalist) {
        return (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setClickCount((c) => c + 1)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4FF00] text-black font-mono font-bold text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FFFFFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform cursor-pointer"
            >
              <span>{component.name}</span>
              <span className="font-mono text-xs">[{clickCount}]</span>
            </button>
            <span className="text-xs font-mono text-zinc-400">
              Interactive test: clicked {clickCount} times
            </span>
          </div>
        );
      }

      if (isEditorial) {
        return (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setClickCount((c) => c + 1)}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-[2px] bg-[#1E1B18] text-[#F4EFEA] font-serif text-sm tracking-wide hover:bg-[#A84B24] transition-colors duration-300 border border-[#1E1B18] cursor-pointer"
            >
              <span>{component.name}</span>
              <span className="font-mono text-xs">→ ({clickCount})</span>
            </button>
            <span className="text-xs font-mono text-stone-500">
              Trigger Count: {clickCount}
            </span>
          </div>
        );
      }

      // Default Obsidian / Kinetic
      return (
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setClickCount((c) => c + 1)}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-[0.98] border border-indigo-400/30 overflow-hidden cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 transition-transform group-hover:rotate-12" />
            <span>{component.name}</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-800 text-[10px] font-mono">
              {clickCount}
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
          </button>
          <span className="text-xs font-mono text-slate-400">
            Interactive click telemetry active
          </span>
        </div>
      );
    }

    // 2. Metric HUD Card / Data Card
    if (id.includes('metric') || id.includes('card') || name.includes('card') || name.includes('hud')) {
      const isBrutalist = system.identity.slug === 'acid-brutalism';
      if (isBrutalist) {
        return (
          <div className="max-w-md p-5 bg-[#161912] border-2 border-[#D4FF00] shadow-[6px_6px_0px_#D4FF00] text-white">
            <div className="text-xs font-mono font-bold text-[#D4FF00] mb-1">TELEMETRY // LIVE</div>
            <h4 className="text-lg font-bold uppercase">{component.name}</h4>
            <div className="text-2xl font-black font-mono mt-2 text-[#D4FF00]">
              {94.8 + clickCount * 0.4}% EFFICIENCY
            </div>
          </div>
        );
      }

      return (
        <div
          onClick={() => setClickCount((c) => c + 1)}
          className="max-w-md p-5 rounded-xl bg-[#11131B] border border-[#23283B] hover:border-indigo-500/50 transition-all shadow-xl relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
              {component.name}
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {(1420 + clickCount * 18).toLocaleString()} ms
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span>▲ +14.2% SYNCHRONIZED</span>
            <span className="text-slate-500">• (click to simulate load)</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      );
    }

    // 3. Command / Input field
    if (id.includes('input') || id.includes('command') || name.includes('input') || name.includes('field')) {
      return (
        <div className="max-w-md relative flex items-center w-full">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type here to test reactive focus & typography..."
            className="w-full pl-4 pr-16 py-2.5 rounded-lg bg-[#11131B] text-sm text-slate-100 placeholder-slate-500 border border-[#23283B] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
          />
          <div className="absolute right-3 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#191D2B] border border-[#23283B] text-[10px] font-mono text-slate-400">
            <span>⌘K</span>
          </div>
        </div>
      );
    }

    // 4. Badges / Status pills
    if (id.includes('badge') || id.includes('pill') || name.includes('badge')) {
      return (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE // WCAG AAA</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>AGENT INTEGRATED</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-950/50 text-indigo-300 border border-indigo-500/30">
            <span>TOKENS SYNCED</span>
          </span>
        </div>
      );
    }

    // General fallback component sandbox
    return (
      <div className="p-4 rounded-xl bg-[#0F1118] border border-[#1E2333] max-w-lg">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-bold text-white font-heading">{component.name}</h5>
          <button
            onClick={() => setToggleState(!toggleState)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              toggleState
                ? 'bg-indigo-600 text-white'
                : 'bg-[#181C28] text-slate-300 border border-[#23283B]'
            }`}
          >
            {toggleState ? 'Active' : 'Toggle State'}
          </button>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {component.description}
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-[#10121A] border border-[#1E2333] overflow-hidden shadow-lg">
      {/* Component Header Bar */}
      <div className="p-5 border-b border-[#1A1F2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D0F17]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold text-white tracking-tight">
              {component.name}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#181C28] text-indigo-300 border border-indigo-700/40">
              {component.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {component.description}
          </p>
        </div>

        {/* Copy code button */}
        <button
          type="button"
          onClick={copyActiveCode}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181C28] hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-mono border border-[#23293D] hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy {activeCodeTab.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>

      {/* Live Interactive Sandbox Workspace */}
      <div className="p-6 bg-dot-pattern bg-[#090A0F] border-b border-[#1A1F2E] flex flex-col items-center justify-center min-h-[160px]">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>LIVE INTERACTIVE INSTANCE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">
            TOKEN BINDING: ACTIVE
          </span>
        </div>

        <div className="w-full flex items-center justify-center py-2">
          {renderLiveSandbox()}
        </div>
      </div>

      {/* Code Viewer Tab Navigation */}
      <div className="bg-[#0D0F17] px-4 pt-2 border-b border-[#1E2333] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: 'react', label: 'React (TSX)' },
            { id: 'vue', label: 'Vue 3 (SFC)' },
            { id: 'html', label: 'HTML + Tailwind' },
            { id: 'figma', label: 'Figma DTCG' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-all cursor-pointer border-t border-x ${
                activeCodeTab === tab.id
                  ? 'bg-[#090A0F] text-indigo-300 border-[#1E2333] border-b-transparent'
                  : 'bg-transparent text-slate-400 hover:text-white border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
          PRODUCTION-GRADE COMPONENT CODE
        </span>
      </div>

      {/* Code Content Block */}
      <div className="p-4 bg-[#090A0F] font-mono-code text-xs text-slate-300 max-h-72 overflow-y-auto overflow-x-auto">
        <pre className="font-mono text-[11px] leading-relaxed">
          {activeCodeTab === 'react' && component.reactCode}
          {activeCodeTab === 'vue' && component.vueCode}
          {activeCodeTab === 'html' && (component.htmlCode || component.reactCode)}
          {activeCodeTab === 'figma' &&
            (component.figmaTokens ||
              `// DTCG Token Reference\n{\n  "$type": "component",\n  "$name": "${component.name}",\n  "$path": "${component.id}"\n}`)}
        </pre>
      </div>

      {/* Props Specification Footer */}
      {component.props && component.props.length > 0 && (
        <div className="p-4 bg-[#0B0D14] border-t border-[#181C28] text-xs">
          <span className="font-mono font-bold text-slate-400 text-[11px] uppercase tracking-wider block mb-2">
            Component API / Props Interface
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {component.props.map((p) => (
              <div
                key={p.name}
                className="p-2 rounded-lg bg-[#11131B] border border-[#1E2333] font-mono text-[11px]"
              >
                <div className="text-indigo-300 font-semibold">{p.name}</div>
                <div className="text-slate-400 text-[10px]">
                  Type: <span className="text-slate-200">{p.type}</span>
                </div>
                {p.default && (
                  <div className="text-slate-500 text-[10px]">
                    Default: {p.default}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
