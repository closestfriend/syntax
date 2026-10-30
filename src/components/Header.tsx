import React from 'react';
import { Download } from 'lucide-react';
import { DesignSystem } from '../types/designSystem';

interface HeaderProps {
  currentSystem: DesignSystem;
  onOpenExport: () => void;
  onOpenApiConsole: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverStatus: { status: string; hasApiKey: boolean; lastError?: string | null };
  assetsCount?: number;
}

const tabs = [
  { id: 'workbench', label: 'workbench' },
  { id: 'components', label: 'components' },
  { id: 'assets', label: 'visual studio' },
  { id: 'api', label: 'agent api' },
];

export const Header: React.FC<HeaderProps> = ({
  currentSystem,
  onOpenExport,
  onOpenApiConsole,
  activeTab,
  setActiveTab,
  serverStatus,
  assetsCount = 0,
}) => {
  const ready = serverStatus.status === 'operational' && serverStatus.hasApiKey;
  const missingKey = serverStatus.status === 'operational' && !serverStatus.hasApiKey;
  const checking = serverStatus.status === 'checking';
  const engineFailing = Boolean(serverStatus.lastError);

  const statusLabel = checking
    ? 'checking the engine'
    : engineFailing
    ? 'engine error'
    : ready
    ? 'engine ready'
    : missingKey
    ? 'api key missing'
    : 'engine offline';

  const statusColor = checking
    ? 'var(--ink-faint)'
    : engineFailing
    ? 'var(--brick)'
    : ready
    ? 'var(--lichen)'
    : missingKey
    ? 'var(--ochre)'
    : 'var(--brick)';

  const renderNav = () => (
    <nav className="flex items-center gap-6">
      {tabs.map((tab) => {
        const count =
          tab.id === 'components'
            ? currentSystem.components.length
            : tab.id === 'assets'
            ? assetsCount
            : undefined;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="nav-link"
            data-active={activeTab === tab.id}
          >
            {tab.label}
            {count !== undefined && (
              <span className="ml-1.5 mono text-[10px] text-[var(--ink-faint)]">{count}</span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 header-surface">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between gap-6 py-4">
          <div className="min-w-0">
            <div className="serif text-[26px] leading-none tracking-[-0.02em]">syntax</div>
            <div className="eyebrow mt-1.5 hidden sm:block truncate">
              design system workbench
            </div>
          </div>

          <div className="hidden md:block">{renderNav()}</div>

          <div className="flex items-center gap-5 shrink-0">
            <button
              onClick={onOpenApiConsole}
              className="hidden lg:flex items-center gap-2 text-[11px] mono text-[var(--ink-faint)] hover:text-[var(--ink-soft)] transition-colors"
              title={serverStatus.lastError || 'Open the agent api workbench'}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              <span>{statusLabel}</span>
            </button>

            <button onClick={onOpenExport} className="btn-secondary">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">export package</span>
              <span className="sm:hidden">export</span>
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3 -mt-1 overflow-x-auto quiet-scroll">
          {renderNav()}
        </div>
      </div>
    </header>
  );
};
