import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Layers, 
  ArrowRight,
  Code2,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { DesignSystem, DesignComponent } from '../types/designSystem';
import { InteractiveComponentPreview } from './InteractiveComponentPreview';

interface ComponentsCatalogViewProps {
  system: DesignSystem;
  onSynthesizeVariant: (prompt: string) => Promise<void>;
  isGeneratingVariant: boolean;
}

export const ComponentsCatalogView: React.FC<ComponentsCatalogViewProps> = ({
  system,
  onSynthesizeVariant,
  isGeneratingVariant,
}) => {
  const [variantPrompt, setVariantPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantPrompt.trim() || isGeneratingVariant) return;
    onSynthesizeVariant(variantPrompt);
    setVariantPrompt('');
  };

  const samplePrompts = [
    'Interactive glassmorphism pricing card with annual toggle',
    'High-density data table row with hover action chips',
    'Tactile segmented tab control with spring slider',
    'Brutalist alert banner with countdown timer',
  ];

  const categories = ['all', ...Array.from(new Set(system.components.map((c) => c.category)))];

  const filteredComponents = system.components.filter((c) => {
    const matchesCategory =
      selectedCategory === 'all' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* AI Component Variant Generator Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#121422] via-[#0E111C] to-[#090A0F] border border-indigo-500/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 font-mono text-xs border border-indigo-700/50 mb-3">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-POWERED VARIANT SYNTHESIS</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generate Component Variations from Existing Brand Guidelines
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-sans">
            AI-assisted developers and designers can describe any new component or state. Gemini 3.8 Flash 
            synthesizes React, Vue, and Web Component code strictly bound to your active design tokens.
          </p>

          {/* Form */}
          <form onSubmit={handleGenerate} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={variantPrompt}
                onChange={(e) => setVariantPrompt(e.target.value)}
                placeholder="Describe component: e.g., 'A floating bottom navigation bar with notification badges'..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090A0F] border border-[#23293D] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingVariant || !variantPrompt.trim()}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isGeneratingVariant || !variantPrompt.trim()
                  ? 'bg-indigo-950/50 text-indigo-400/50 border border-indigo-900 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
              }`}
            >
              {isGeneratingVariant ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>SYNTHESIZE VARIANT</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt suggestions pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">Suggested:</span>
            {samplePrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setVariantPrompt(p)}
                className="px-2.5 py-1 rounded-lg bg-[#141826] hover:bg-indigo-950 text-[11px] font-mono text-slate-400 hover:text-indigo-200 border border-[#222738] transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#11131B] border border-[#1E2333]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search component inventory..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#11131B] border border-[#1E2333] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-6">
        {filteredComponents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#11131B] border border-[#1E2333]">
            <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No matching components found</h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or generate a new component using the prompt box above.
            </p>
          </div>
        ) : (
          filteredComponents.map((comp) => (
            <InteractiveComponentPreview
              key={comp.id}
              component={comp}
              system={system}
            />
          ))
        )}
      </div>
    </div>
  );
};
