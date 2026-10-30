import React, { useState } from 'react';
import { DesignSystem } from '../types/designSystem';
import { ColorTokensView } from './ColorTokensView';
import { TypographyMatrixView } from './TypographyMatrixView';
import { SpatialArchitectureView } from './SpatialArchitectureView';

interface DesignSystemWorkbenchProps {
  system: DesignSystem;
  onNavigateToComponents: () => void;
}

export const DesignSystemWorkbench: React.FC<DesignSystemWorkbenchProps> = ({
  system,
  onNavigateToComponents,
}) => {
  const requestedSub = new URLSearchParams(window.location.search).get('sub');
  const initialSub =
    requestedSub === 'typography' || requestedSub === 'spatial' ? requestedSub : 'colors';
  const [activeSubTab, setActiveSubTab] = useState<'colors' | 'typography' | 'spatial'>(initialSub);

  const tokenCount =
    system.colors.palette.length +
    system.typography.steps.length +
    system.spatial.spacingScale.length;

  const subTabs = [
    { id: 'colors', label: 'color', count: system.colors.palette.length },
    { id: 'typography', label: 'type', count: system.typography.steps.length },
    { id: 'spatial', label: 'space & motion' },
  ];

  return (
    <div className="space-y-14">
      <section id="current-system" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 scroll-mt-24">
        <div className="lg:col-span-8">
          <div className="eyebrow">current system</div>
          <h2 className="serif mt-4 text-[2.4rem] sm:text-[3rem] leading-[1.08]">
            {system.identity.name}
          </h2>
          <p className="serif italic text-[19px] text-[var(--ink-soft)] mt-3">
            {system.identity.tagline}
          </p>
          <p className="measure mt-5 text-[14px] leading-[1.75] text-[var(--ink-soft)]">
            {system.identity.description}
          </p>

          {system.identity.visualEthos && system.identity.visualEthos.length > 0 && (
            <div className="mt-9 pt-6 border-t border-[var(--rule)]">
              <div className="eyebrow mb-4">principles</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
                {system.identity.visualEthos.map((ethos, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="mt-[11px] h-px w-3 shrink-0 bg-[var(--rule-strong)]" />
                    <span className="text-[13px] leading-[1.6] text-[var(--ink-soft)]">
                      {ethos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 lg:pl-10 lg:border-l lg:border-[var(--rule)]">
          <dl className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
            <div className="py-4 flex items-baseline justify-between gap-4">
              <dt className="eyebrow">tokens mapped</dt>
              <dd className="serif text-[26px] leading-none">{tokenCount}</dd>
            </div>
            <div className="py-4 flex items-baseline justify-between gap-4">
              <dt className="eyebrow">components ready</dt>
              <dd className="flex items-baseline gap-3">
                <span className="serif text-[26px] leading-none">{system.components.length}</span>
                <button onClick={onNavigateToComponents} className="btn-quiet text-[12px]">
                  view
                </button>
              </dd>
            </div>
            <div className="py-4 flex items-baseline justify-between gap-4">
              <dt className="eyebrow">theme</dt>
              <dd className="text-[13px] text-[var(--ink-soft)]">{system.identity.mode}</dd>
            </div>
          </dl>

          <p className="mt-4 text-[12px] leading-[1.7] text-[var(--ink-faint)]">
            everything here is editable in the export. take only what you need.
          </p>
        </aside>
      </section>

      <div className="flex items-center gap-8 border-b border-[var(--rule)] overflow-x-auto quiet-scroll">
        {subTabs.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className="tab-link"
            data-active={activeSubTab === sub.id}
          >
            {sub.label}
            {sub.count !== undefined && (
              <span className="ml-1.5 mono text-[10px] text-[var(--ink-faint)]">{sub.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="fade-in">
        {activeSubTab === 'colors' && <ColorTokensView colors={system.colors} />}
        {activeSubTab === 'typography' && <TypographyMatrixView typography={system.typography} />}
        {activeSubTab === 'spatial' && <SpatialArchitectureView spatial={system.spatial} />}
      </div>
    </div>
  );
};
