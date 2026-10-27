import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  HeroUploader 
} from './components/HeroUploader';
import { 
  DesignSystemWorkbench 
} from './components/DesignSystemWorkbench';
import { 
  ComponentsCatalogView 
} from './components/ComponentsCatalogView';
import { 
  ImageAssetStudio 
} from './components/ImageAssetStudio';
import { 
  AgentApiWorkbench 
} from './components/AgentApiWorkbench';
import { 
  ExportDrawer 
} from './components/ExportDrawer';
import { 
  PRESET_SYSTEMS, 
  PresetItem 
} from './data/presets';
import { 
  DesignSystem, 
  ScreenshotItem, 
  DesignComponent,
  GeneratedAsset 
} from './types/designSystem';
import { 
  analyzeScreenshotsApi, 
  generateComponentVariantApi, 
  checkServerHealth 
} from './services/api';
import { 
  Sparkles, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [currentSystem, setCurrentSystem] = useState<DesignSystem>(PRESET_SYSTEMS[0].system);
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([
    {
      id: 'ast_init_1',
      name: 'Kinetic Core Monogram',
      imageUrl: PRESET_SYSTEMS[0].previewImage,
      originalPrompt: 'Monogram icon for obsidian kinetic platform',
      synthesizedPrompt: 'Minimalist 3D faceted geometric obsidian crystal core with internal laser-cyan refraction, floating on deep black void (#090A0F) with sub-pixel indigo rim light (#6366F1)',
      designSystemAlignment: 'Enforces Obsidian Core Canvas (#090A0F), Electric Indigo (#6366F1) rim highlight, and Laser Cyan (#06B6D4) status beacon.',
      appliedTokens: ['Core Canvas #090A0F', 'Electric Indigo #6366F1', 'Laser Cyan #06B6D4', 'Radius 14px'],
      aspectRatio: '1:1',
      imageSize: '1K',
      assetType: 'ui-artifact',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeTab, setActiveTab] = useState<'workbench' | 'components' | 'assets' | 'api'>('workbench');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState({ status: 'checking', hasApiKey: true });

  useEffect(() => {
    checkServerHealth().then((status) => {
      setServerStatus(status);
    });
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleAddScreenshot = (item: ScreenshotItem) => {
    setScreenshots((prev) => [...prev, item]);
    showToast(`Added ${item.name}`);
  };

  const handleRemoveScreenshot = (id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearScreenshots = () => {
    setScreenshots([]);
  };

  const handleAddAsset = (asset: GeneratedAsset) => {
    setAssets((prev) => [asset, ...prev]);
    showToast(`Rendered brand asset: "${asset.name}"`);
  };

  const handleUpdateAsset = (asset: GeneratedAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
    showToast(`Updated asset variant: "${asset.name}"`);
  };

  const handleSetAsScreenshot = (dataUrl: string, name: string) => {
    setScreenshots((prev) => [
      ...prev,
      {
        id: `scr_ast_${Date.now()}`,
        name: `Asset_${name}`,
        dataUrl,
        mimeType: 'image/png',
      },
    ]);
    showToast(`Imported ${name} into screenshot queue for deconstruction!`);
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setCurrentSystem(preset.system);
    showToast(`Loaded ${preset.name} design system archive`);
  };

  const handleSynthesize = async (brandContext: string) => {
    if (screenshots.length === 0) {
      setErrorMessage('Please upload or paste at least one screenshot before synthesizing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    // Multi-step progressive status messages for high-tech feedback
    setAnalysisStep('SCANNING PIXEL LUMINANCE...');
    const stepTimer1 = setTimeout(() => setAnalysisStep('EXTRACTING COLOR & WCAG MATRICES...'), 1800);
    const stepTimer2 = setTimeout(() => setAnalysisStep('CALCULATING MODULAR TYPOGRAPHY...'), 3600);
    const stepTimer3 = setTimeout(() => setAnalysisStep('COMPILING REACT & VUE RIGS...'), 5400);

    try {
      const payloadImages = screenshots.map((s) => ({
        base64: s.dataUrl,
        mimeType: s.mimeType,
        name: s.name,
      }));

      const res = await analyzeScreenshotsApi(payloadImages, brandContext);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (res.data) {
        setCurrentSystem(res.data);
        showToast(`Synthesized "${res.data.identity?.name || 'New Design System'}" successfully`);
        setActiveTab('workbench');
      }
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      console.error('Synthesis failed:', err);
      setErrorMessage(
        err.message || 'Failed to synthesize design system from screenshots. Verify Gemini API connectivity.'
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSynthesizeVariant = async (prompt: string) => {
    setIsGeneratingVariant(true);
    setErrorMessage(null);

    try {
      const res = await generateComponentVariantApi(prompt, currentSystem);
      if (res.data) {
        const newComponent: DesignComponent = res.data;
        setCurrentSystem((prev) => ({
          ...prev,
          components: [newComponent, ...prev.components],
        }));
        showToast(`Generated "${newComponent.name}" component variant!`);
      }
    } catch (err: any) {
      console.error('Variant synthesis failed:', err);
      setErrorMessage(err.message || 'Failed to generate component variant.');
    } finally {
      setIsGeneratingVariant(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#F3F4F6] selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        currentSystem={currentSystem}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenApiConsole={() => setActiveTab('api')}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        serverStatus={serverStatus}
        assetsCount={assets.length}
      />

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="px-4 py-3 bg-rose-950/90 border-b border-rose-800 text-rose-200 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white ml-2 text-xs font-mono uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Screenshot Deconstruction & Uploader */}
      <HeroUploader
        screenshots={screenshots}
        onAddScreenshot={handleAddScreenshot}
        onRemoveScreenshot={handleRemoveScreenshot}
        onClearScreenshots={handleClearScreenshots}
        onSynthesize={handleSynthesize}
        onSelectPreset={handleSelectPreset}
        isAnalyzing={isAnalyzing}
        analysisStep={analysisStep}
        currentSystem={currentSystem}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'workbench' && (
          <DesignSystemWorkbench
            system={currentSystem}
            onNavigateToComponents={() => setActiveTab('components')}
          />
        )}

        {activeTab === 'components' && (
          <ComponentsCatalogView
            system={currentSystem}
            onSynthesizeVariant={handleSynthesizeVariant}
            isGeneratingVariant={isGeneratingVariant}
          />
        )}

        {activeTab === 'assets' && (
          <ImageAssetStudio
            system={currentSystem}
            assets={assets}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onSetAsScreenshot={handleSetAsScreenshot}
          />
        )}

        {activeTab === 'api' && <AgentApiWorkbench system={currentSystem} />}
      </main>

      {/* Export Package Drawer */}
      <ExportDrawer
        system={currentSystem}
        assets={assets}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Visionary Footer */}
      <footer className="w-full border-t border-[#161A26] bg-[#07080C] py-8 px-4 sm:px-6 mt-16 text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">SYNTAX // CORE</span>
            <span>•</span>
            <span>W3C DTCG SPEC</span>
            <span>•</span>
            <span>TOKENS STUDIO</span>
            <span>•</span>
            <span>GEMINI 3.8 FLASH</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>DEVELOPER & DESIGNER CONTINUUM</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('api')}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              REST API OPENAPI 3.1
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
