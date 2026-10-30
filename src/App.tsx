import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroUploader } from './components/HeroUploader';
import { DesignSystemWorkbench } from './components/DesignSystemWorkbench';
import { ComponentsCatalogView } from './components/ComponentsCatalogView';
import { ImageAssetStudio } from './components/ImageAssetStudio';
import { AgentApiWorkbench } from './components/AgentApiWorkbench';
import { ExportDrawer } from './components/ExportDrawer';
import { PRESET_SYSTEMS, PresetItem } from './data/presets';
import {
  DesignSystem,
  ScreenshotItem,
  DesignComponent,
  GeneratedAsset,
} from './types/designSystem';
import {
  analyzeScreenshotsApi,
  generateComponentVariantApi,
  checkServerHealth,
} from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const initialPreset =
  PRESET_SYSTEMS.find((p) => p.id === 'overcast-room') || PRESET_SYSTEMS[0];

const quietPreview = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="%23E9E6E1"/><rect x="0" y="520" width="800" height="1" fill="%232B2A28" opacity="0.3"/><rect x="120" y="300" width="180" height="220" fill="none" stroke="%232B2A28" stroke-width="1" opacity="0.28"/><rect x="560" y="190" width="74" height="74" fill="%23C4704F" opacity="0.9"/><path d="M0 640 Q 400 602 800 640" fill="none" stroke="%232B2A28" stroke-width="1" opacity="0.18"/></svg>`;

const requestedTab = new URLSearchParams(window.location.search).get('tab');
const initialTab =
  requestedTab === 'components' || requestedTab === 'assets' || requestedTab === 'api'
    ? requestedTab
    : 'workbench';

export default function App() {
  const [currentSystem, setCurrentSystem] = useState<DesignSystem>(initialPreset.system);
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([
    {
      id: 'ast_init_1',
      name: 'Quiet Horizon Study',
      imageUrl: quietPreview,
      originalPrompt: 'a quiet horizon for the workbench (sample)',
      synthesizedPrompt:
        'A monochrome horizon study on warm paper grey, one small clay square, no shadow, no gradient.',
      designSystemAlignment:
        'Ground #E9E6E1, ink #2B2A28, a single clay accent #C4704F, hairline rules instead of depth.',
      appliedTokens: ['Ground #E9E6E1', 'Ink #2B2A28', 'Clay #C4704F', 'Radius 10px'],
      aspectRatio: '1:1',
      imageSize: '1K',
      assetType: 'editorial-still',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeTab, setActiveTab] = useState<'workbench' | 'components' | 'assets' | 'api'>(initialTab);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    status: string;
    hasApiKey: boolean;
    lastError?: string | null;
  }>({ status: 'checking', hasApiKey: true });

  const refreshHealth = () => {
    checkServerHealth().then(setServerStatus);
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3600);
  };

  const handleAddScreenshot = (item: ScreenshotItem) => {
    setScreenshots((prev) => [...prev, item]);
    showToast('screenshot added.');
  };

  const handleRemoveScreenshot = (id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearScreenshots = () => {
    setScreenshots([]);
  };

  const handleAddAsset = (asset: GeneratedAsset) => {
    setAssets((prev) => [asset, ...prev]);
    showToast('render added to this tab. download it to keep a copy.');
  };

  const handleUpdateAsset = (asset: GeneratedAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
    showToast('variant saved.');
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
    setActiveTab('workbench');
    showToast('added to the screenshot queue. synthesize the system when you are ready.');
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setCurrentSystem(preset.system);
    showToast(`loaded ${preset.system.identity.name.toLowerCase()}.`);
    window.setTimeout(() => {
      document.getElementById('current-system')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSynthesize = async (brandContext: string) => {
    if (screenshots.length === 0) {
      setErrorMessage('nothing to read yet. add a screenshot to begin.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    setAnalysisStep('reading the screen');
    const stepTimer1 = setTimeout(() => setAnalysisStep('measuring color and contrast'), 1800);
    const stepTimer2 = setTimeout(() => setAnalysisStep('following the type scale'), 3600);
    const stepTimer3 = setTimeout(() => setAnalysisStep('assembling components'), 5400);

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
        showToast('your system is ready.');
        setActiveTab('workbench');
      }
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      console.error('Synthesis failed:', err);
      setErrorMessage(
        err.message || 'the screen could not be read. check the api connection and try again.'
      );
      refreshHealth();
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSynthesizeVariant = async (prompt: string): Promise<boolean> => {
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
        showToast('component added to the catalog.');
        refreshHealth();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Variant synthesis failed:', err);
      setErrorMessage(err.message || 'the variant could not be generated. try again in a moment.');
      refreshHealth();
      return false;
    } finally {
      setIsGeneratingVariant(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentSystem={currentSystem}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenApiConsole={() => setActiveTab('api')}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        serverStatus={serverStatus}
        assetsCount={assets.length}
      />

      {successToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[60] fade-in"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--rule)] bg-[var(--paper)] text-[13px] text-[var(--ink-soft)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--lichen)] shrink-0" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="w-full bg-[var(--paper)] border-b border-[var(--rule)]">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-3.5 flex items-start justify-between gap-4 border-l-2 border-l-[var(--brick)]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[var(--brick)] shrink-0 mt-0.5" />
              <span className="text-[13px] text-[var(--brick)] leading-relaxed">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="btn-quiet shrink-0 text-[12px]"
            >
              dismiss
            </button>
          </div>
        </div>
      )}

      {activeTab === 'workbench' && (
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
      )}

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 py-16">
        {activeTab !== 'workbench' && (
          <h1 className="sr-only">
            {activeTab === 'components'
              ? 'component catalog'
              : activeTab === 'assets'
              ? 'visual studio'
              : 'agent api'}
          </h1>
        )}

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
            onEngineActivity={refreshHealth}
          />
        )}

        {activeTab === 'api' && (
          <AgentApiWorkbench system={currentSystem} onEngineActivity={refreshHealth} />
        )}
      </main>

      <ExportDrawer
        system={currentSystem}
        assets={assets}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <footer className="w-full border-t border-[var(--rule)] mt-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="serif text-[22px] leading-none">syntax</div>
            <p className="text-[13px] text-[var(--ink-faint)] mt-2 measure">
              a quiet workbench for reading and keeping design systems.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-[var(--ink-faint)] mono">
            <button
              onClick={() => setActiveTab('api')}
              className="hover:text-[var(--ink-soft)] hover:underline underline-offset-4 transition-colors"
            >
              agent api
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-[var(--ink-soft)] hover:underline underline-offset-4 transition-colors"
            >
              export
            </button>
            <span className="text-[var(--rule-strong)]">w3c dtcg</span>
            <span className="text-[var(--rule-strong)]">openrouter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
