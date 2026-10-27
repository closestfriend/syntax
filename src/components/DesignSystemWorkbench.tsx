import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Box, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Layers,
  Code2
} from 'lucide-react';
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
  const [activeSubTab, setActiveSubTab] = useState<'colors' | 'typography' | 'spatial'>('colors');

  return (
    <div className="space-y-8">
      {/* Brand Identity & Strategy Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0F17] border border-[#1E2333] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                ARCHETYPE // {system.identity.archetype}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-[#181C28] text-slate-400 border border-[#23283B]">
                THEME: {system.identity.mode.toUpperCase()}
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {system.identity.name}
            </h2>
            <p className="text-sm font-sans text-indigo-200 mt-1 font-medium">
              "{system.identity.tagline}"
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-3 leading-relaxed">
              {system.identity.description}
            </p>
          </div>

          {/* Quick Metrics HUD */}
          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[#08090F] border border-[#1C2030] min-w-[160px]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Tokens Mapped</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {system.colors.palette.length + system.typography.steps.length + system.spatial.spacingScale.length}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#08090F] border border-[#1C2030] min-w-[160px]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Component Rigs</span>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-0.5 flex items-center justify-between">
                <span>{system.components.length} READY</span>
                <button
                  type="button"
                  onClick={onNavigateToComponents}
                  className="text-xs text-indigo-300 hover:text-white underline cursor-pointer"
                >
                  View →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Ethos Badges */}
        {system.identity.visualEthos && system.identity.visualEthos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#181C28]">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2.5">
              Structural & Design Principles:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {system.identity.visualEthos.map((ethos, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#08090F] border border-[#1C2030] text-xs text-slate-300 font-sans flex items-start gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{ethos}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1E2333] pb-2 overflow-x-auto">
        {[
          { id: 'colors', label: 'Color Tokens & Contrast', icon: Palette, count: system.colors.palette.length },
          { id: 'typography', label: 'Typography Hierarchy', icon: Type, count: system.typography.steps.length },
          { id: 'spatial', label: 'Spatial, Elevation & Motion', icon: Box },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'bg-[#10121A] text-slate-400 hover:text-white hover:bg-[#151926]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
              {sub.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-[#181C28] text-slate-400'
                  }`}
                >
                  {sub.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content Panels */}
      {activeSubTab === 'colors' && <ColorTokensView colors={system.colors} />}
      {activeSubTab === 'typography' && <TypographyMatrixView typography={system.typography} />}
      {activeSubTab === 'spatial' && <SpatialArchitectureView spatial={system.spatial} />}
    </div>
  );
};
