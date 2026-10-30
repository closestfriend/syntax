import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { DesignSystem, GeneratedAsset } from '../types/designSystem';
import { useDialog } from '../hooks/useDialog';
import {
  generateFigmaTokensJson,
  generateTailwindConfig,
  generateCssVariables,
  generateTypeScriptDefinitions,
  generateMarkdownSpec,
  downloadDesignSystemZip,
} from '../utils/exporters';

interface ExportDrawerProps {
  system: DesignSystem;
  assets?: GeneratedAsset[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDrawer: React.FC<ExportDrawerProps> = ({
  system,
  assets = [],
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'figma' | 'tailwind' | 'css' | 'typescript' | 'markdown'>('figma');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const panelRef = useDialog<HTMLDivElement>(isOpen, onClose);

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
    setZipError(null);
    try {
      await downloadDesignSystemZip(system, assets);
    } catch (err: any) {
      console.error('Failed to download zip:', err);
      setZipError(
        err?.message
          ? `the package could not be built: ${err.message}`
          : 'the package could not be built. try again, or copy the tokens instead.'
      );
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const tabs = [
    { id: 'figma', label: 'figma tokens' },
    { id: 'tailwind', label: 'tailwind' },
    { id: 'css', label: 'css variables' },
    { id: 'typescript', label: 'typescript' },
    { id: 'markdown', label: 'readme' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 scrim flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="export the design system"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[var(--rule)] flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-[var(--paper)] shrink-0">
          <div>
            <div className="eyebrow">export</div>
            <h3 className="serif text-[24px] mt-2">Take the system with you.</h3>
            <p className="text-[12px] text-[var(--ink-soft)] mt-1">
              tokens, styles and component code, ready for the tools you already use.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="btn-primary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingZip ? 'bundling' : 'download .zip'}</span>
            </button>

            <button onClick={onClose} className="icon-btn" title="close" aria-label="close the export panel">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {zipError && (
          <p
            role="alert"
            className="px-6 py-3 border-b border-[var(--rule)] bg-[var(--paper)] text-[12.5px] text-[var(--brick)] leading-relaxed shrink-0"
          >
            {zipError}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 px-6 border-b border-[var(--rule)] bg-[var(--paper)] overflow-x-auto quiet-scroll shrink-0">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="tab-link text-[12px]"
                data-active={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={handleCopy} className="btn-quiet text-[11px] shrink-0">
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[var(--lichen)]" />
                <span className="text-[var(--lichen)]">copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>copy</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 flex-1 overflow-auto bg-[var(--ground-deep)] quiet-scroll">
          <pre className="mono text-[10.5px] leading-[1.75] text-[var(--ink-soft)] select-all">
            {getActiveContent()}
          </pre>
        </div>

        <div className="p-4 bg-[var(--paper)] border-t border-[var(--rule)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] mono text-[var(--ink-faint)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lichen)]" />
            <span>figma tokens studio, style dictionary and tailwind compatible</span>
          </div>
          <span>
            {system.components.length} components · {assets.length} assets
          </span>
        </div>
      </div>
    </div>
  );
};
