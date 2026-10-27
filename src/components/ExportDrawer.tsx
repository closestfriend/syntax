import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  FileCode, 
  Palette, 
  Package, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DesignSystem, GeneratedAsset } from '../types/designSystem';
import { 
  generateFigmaTokensJson, 
  generateTailwindConfig, 
  generateCssVariables, 
  generateTypeScriptDefinitions, 
  generateMarkdownSpec,
  downloadDesignSystemZip 
} from '../utils/exporters';

interface ExportDrawerProps {
  system: DesignSystem;
  assets?: GeneratedAsset[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDrawer: React.FC<ExportDrawerProps> = ({ system, assets = [], isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'figma' | 'tailwind' | 'css' | 'typescript' | 'markdown'>('figma');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getActiveContent = () => {
    switch (activeTab) {
      case 'figma':
        return generateFigmaTokensJson(system);
      case 'tailwind':
        return generateTailwindConfig(system);
      case 'css':
        return generateCssVariables(system);
      case 'typescript':
        return generateTypeScriptDefinitions(system);
      case 'markdown':
        return generateMarkdownSpec(system);
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadDesignSystemZip(system, assets);
    } catch (err) {
      console.error('Failed to download zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0D0F17] border border-[#22283A] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1F2E] flex items-center justify-between bg-[#10121A]">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                Export Design System Package
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Production-ready token packages for Figma, React, Vue, and Tailwind CSS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold tracking-wide transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingZip ? 'BUNDLING ZIP...' : 'DOWNLOAD .ZIP PACKAGE'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#181C28] hover:bg-[#202538] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 bg-[#090A0F] border-b border-[#1A1F2E] overflow-x-auto">
          <div className="flex items-center gap-2 py-2">
            {[
              { id: 'figma', label: 'Figma Tokens (DTCG)', icon: FileJson },
              { id: 'tailwind', label: 'Tailwind Config', icon: FileCode },
              { id: 'css', label: 'CSS Variables', icon: Palette },
              { id: 'typescript', label: 'TypeScript Types', icon: FileCode },
              { id: 'markdown', label: 'Spec (README.md)', icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#151926]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151926] hover:bg-[#1E2336] text-xs font-mono text-slate-300 hover:text-white border border-[#22283A] transition-colors cursor-pointer shrink-0 ml-4"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#07080C] font-mono-code text-xs text-slate-300">
          <pre className="text-[11px] leading-relaxed select-all">
            {getActiveContent()}
          </pre>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-[#0D0F17] border-t border-[#1A1F2E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Figma Tokens Studio, Style Dictionary, and Tailwind CSS v3/v4 compatible.</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {system.components.length} components included in zip export
          </span>
        </div>
      </div>
    </div>
  );
};
