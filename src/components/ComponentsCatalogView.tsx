import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { DesignSystem } from '../types/designSystem';
import { InteractiveComponentPreview } from './InteractiveComponentPreview';

interface ComponentsCatalogViewProps {
  system: DesignSystem;
  onSynthesizeVariant: (prompt: string) => Promise<boolean>;
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantPrompt.trim() || isGeneratingVariant) return;
    const added = await onSynthesizeVariant(variantPrompt);
    if (added) setVariantPrompt('');
  };

  const samplePrompts = [
    'interactive pricing card with an annual toggle',
    'data table row with quiet hover actions',
    'segmented tab control with a soft slider',
    'alert banner with a countdown',
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
    <div className="space-y-12">
      <section className="max-w-3xl">
        <div className="eyebrow">variant synthesis</div>
        <h2 className="serif text-[2rem] sm:text-[2.5rem] leading-[1.12] mt-4">
          Describe a component. Keep the system.
        </h2>
        <p className="measure mt-4 text-[14px] leading-[1.75] text-[var(--ink-soft)]">
          Say what you need in plain words. The catalog will grow a new variant bound to
          the active tokens, with React, Vue and HTML ready to take with you.
        </p>

        <form onSubmit={handleGenerate} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={variantPrompt}
            onChange={(e) => setVariantPrompt(e.target.value)}
            placeholder="e.g. a floating bottom navigation with quiet badges"
            className="input flex-1"
            aria-label="describe the component to generate"
          />
          <button
            type="submit"
            disabled={isGeneratingVariant || !variantPrompt.trim()}
            className="btn-primary shrink-0"
          >
            {isGeneratingVariant ? (
              <span>reading the description</span>
            ) : (
              <>
                <span>generate variant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">try</span>
          {samplePrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setVariantPrompt(p)}
              className="tag hover:border-[var(--ink-faint)] hover:text-[var(--ink-soft)] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule)] pb-3">
        <div className="flex flex-wrap items-center gap-4">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-faint)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search the catalog"
            className="input pl-9 py-2 text-[12.5px]"
            aria-label="search the component catalog"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredComponents.length === 0 ? (
          <div className="max-w-xl pt-4">
            <h4 className="serif text-[24px]">Nothing matches that.</h4>
            <p className="mt-2 text-[13.5px] leading-[1.7] text-[var(--ink-soft)]">
              Try a quieter search, or describe the component above and let the catalog grow.
            </p>
          </div>
        ) : (
          filteredComponents.map((comp) => (
            <InteractiveComponentPreview key={comp.id} component={comp} system={system} />
          ))
        )}
      </div>
    </div>
  );
};
