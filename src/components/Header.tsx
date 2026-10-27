import React from 'react';
import { 
  Sparkles, 
  Download, 
  Terminal, 
  Code2, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';
import { DesignSystem } from '../types/designSystem';

interface HeaderProps {
  currentSystem: DesignSystem;
  onOpenExport: () => void;
  onOpenApiConsole: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverStatus: { status: string; hasApiKey: boolean };
  assetsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSystem,
  onOpenExport,
  onOpenApiConsole,
  activeTab,
  setActiveTab,
  serverStatus,
  assetsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E2333] bg-[#090A0F]/90 backdrop-blur-md">
      {/* Top micro-ticker ticker line */}
      <div className="flex items-center justify-between px-4 py-1 text-[11px] font-mono border-b border-[#151926] text-slate-400 bg-[#07080C]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-indigo-400 font-semibold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            SYNTAX // ENGINE 3.8
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">
            CORE: <span className="text-slate-200">{currentSystem.identity.name}</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            MODE: <span className="text-indigo-300 uppercase">{currentSystem.identity.mode}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">AGENT API:</span>
            <span className="text-emerald-400 font-medium">READY</span>
          </div>

          <button
            onClick={onOpenApiConsole}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Open Machine-to-Machine & Agent API Workbench"
          >
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span className="underline decoration-indigo-500/40 underline-offset-2">AGENT REST API</span>
          </button>
        </div>
      </div>

      {/* Main navigation line */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-700 to-purple-800 text-white font-mono font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/30">
            <span className="text-sm tracking-tighter">SX</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-bold tracking-tight text-white">
                SYNTAX
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-700/40">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide hidden sm:block">
              UI Reverse-Engineering & Design System Synthesis
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-[#10121A] p-1 rounded-xl border border-[#1E2333]">
          {[
            { id: 'workbench', label: 'Workbench', icon: Layers },
            { id: 'components', label: 'Components', icon: Code2, count: currentSystem.components.length },
            { id: 'assets', label: 'Visual Studio', icon: ImageIcon, count: assetsCount },
            { id: 'api', label: 'Agent API', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#181C28]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-[#1C2030] text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button Suite */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#151926] hover:bg-[#1E2438] text-slate-200 hover:text-white text-xs font-mono border border-[#23293D] transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export Package</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
