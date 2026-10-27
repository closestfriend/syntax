import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Cpu, 
  ExternalLink, 
  Code2, 
  Bot, 
  Download,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { DesignSystem } from '../types/designSystem';

interface AgentApiWorkbenchProps {
  system: DesignSystem;
}

export const AgentApiWorkbench: React.FC<AgentApiWorkbenchProps> = ({ system }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<'analyze' | 'generateVariant' | 'generateAsset' | 'openapi'>('analyze');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Agent Prompt Context Generator
  const generateAgentSystemPrompt = () => {
    return `### SYSTEM CONTEXT: DESIGN SYSTEM RULES FOR "${system.identity.name.toUpperCase()}"
Archetype: ${system.identity.archetype}
Theme Mode: ${system.identity.mode}

SURFACES:
- Canvas: ${system.colors.surfaces.canvas}
- Surface: ${system.colors.surfaces.surface}
- Elevated: ${system.colors.surfaces.elevated}
- Border: ${system.colors.surfaces.border}
- Text Primary: ${system.colors.surfaces.textPrimary}
- Text Secondary: ${system.colors.surfaces.textSecondary}

KEY BRAND & ACCENT COLORS:
${system.colors.palette.slice(0, 6).map((c) => `- ${c.name}: ${c.hex} (${c.role})`).join('\n')}

TYPOGRAPHY:
- Sans Family: ${system.typography.fontFamilies.sans}
- Display Family: ${system.typography.fontFamilies.display}
- Modular Scale: ${system.typography.scaleRatio}

SPATIAL:
- Base Grid: ${system.spatial.gridBase}
- Corner Radii: ${system.spatial.radii.map((r) => `${r.token}: ${r.value}`).join(', ')}
- Default Easing: ${system.spatial.motion.easingDefault}

DIRECTIVE FOR CODE & ASSET GENERATION:
When generating UI components or visual assets for this system, strictly use the Tailwind classes and palette colors defined above. Do not introduce arbitrary colors or uncoordinated font sizes. All border strokes must respect the surface border tokens.`;
  };

  const handleTestCall = async () => {
    setIsCallingApi(true);
    setTestResponse(null);

    try {
      if (activeEndpoint === 'generateVariant') {
        const res = await fetch('/api/v1/design-system/generate-variant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'Synthesize an interactive notification toast pill with status icon',
            designSystem: system,
          }),
        });
        const json = await res.json();
        setTestResponse(JSON.stringify(json, null, 2));
      } else if (activeEndpoint === 'openapi') {
        const res = await fetch('/api/v1/design-system/openapi.json');
        const json = await res.json();
        setTestResponse(JSON.stringify(json, null, 2));
      } else {
        // Health / analyze spec
        const res = await fetch('/api/health');
        const json = await res.json();
        setTestResponse(JSON.stringify(json, null, 2));
      }
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  const curlAnalyze = `curl -X POST "${window.location.origin}/api/v1/design-system/analyze" \\
  -H "Content-Type: application/json" \\
  -d '{
    "images": [
      {
        "base64": "<BASE64_IMAGE_STRING>",
        "mimeType": "image/png"
      }
    ],
    "brandContext": "Modern developer platform dark mode"
  }'`;

  const curlVariant = `curl -X POST "${window.location.origin}/api/v1/design-system/generate-variant" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Interactive audio playback scrubber with volume slider",
    "designSystem": { ... }
  }'`;

  const curlAsset = `curl -X POST "${window.location.origin}/api/v1/design-system/generate-asset" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "3D kinetic obsidian crystal core",
    "designSystem": { ... },
    "assetType": "ui-artifact",
    "aspectRatio": "1:1",
    "imageSize": "1K"
  }'`;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121422] to-[#0A0C14] border border-[#1E2333]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 font-mono text-xs border border-cyan-700/50 mb-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>MACHINE-TO-MACHINE & HUMAN AGENT PROTOCOL</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-white tracking-tight">
              Cross-Platform Agent API & Token Exchange
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
              Equip autonomous agents (Cursor, Claude Code, GitHub Copilot, custom LangChain/AutoGPT agents) 
              with machine-readable token schemas, real-time variant synthesis endpoints, and OpenAPI 3.1 definitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => copyText(generateAgentSystemPrompt(), 'agent-prompt')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {copiedKey === 'agent-prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>Copy Agent System Prompt</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Endpoint Documentation & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints navigation */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-wider">
            Available REST Endpoints
          </h4>

          {[
            {
              id: 'analyze',
              method: 'POST',
              path: '/api/v1/design-system/analyze',
              desc: 'Deconstruct UI screenshots into design tokens & components',
            },
            {
              id: 'generateVariant',
              method: 'POST',
              path: '/api/v1/design-system/generate-variant',
              desc: 'Synthesize new component variations from active tokens',
            },
            {
              id: 'generateAsset',
              method: 'POST',
              path: '/api/v1/design-system/generate-asset',
              desc: 'Generate brand visual assets with gemini-nano-banana-2.1 and Gemini LLM prompt logic',
            },
            {
              id: 'openapi',
              method: 'GET',
              path: '/api/v1/design-system/openapi.json',
              desc: 'OpenAPI 3.1 schema for autonomous agent tool integration',
            },
          ].map((ep) => {
            const isActive = activeEndpoint === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => setActiveEndpoint(ep.id as any)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#151926] border-indigo-500 shadow-md'
                    : 'bg-[#10121A] border-[#1E2333] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ep.method === 'POST' ? 'bg-indigo-950 text-indigo-300' : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono text-white font-semibold truncate">
                    {ep.path}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{ep.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Endpoint Inspector & Runner */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0D0F17] border border-[#1E2333] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#1A1F2E] flex items-center justify-between bg-[#10121A]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-slate-300 font-semibold">
                cURL & Live Execution Console
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  copyText(
                    activeEndpoint === 'analyze'
                      ? curlAnalyze
                      : activeEndpoint === 'generateVariant'
                      ? curlVariant
                      : activeEndpoint === 'generateAsset'
                      ? curlAsset
                      : `curl "${window.location.origin}/api/v1/design-system/openapi.json"`,
                    'curl'
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#181C28] hover:bg-[#202538] text-slate-300 text-[11px] font-mono cursor-pointer"
              >
                {copiedKey === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy cURL</span>
              </button>

              <button
                onClick={handleTestCall}
                disabled={isCallingApi}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono font-semibold cursor-pointer shadow-sm"
              >
                {isCallingApi ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>Run Request</span>
              </button>
            </div>
          </div>

          {/* cURL Display */}
          <div className="p-4 bg-[#090A0F] font-mono text-xs text-slate-300 border-b border-[#1A1F2E] overflow-x-auto">
            <pre className="text-[11px] text-indigo-200">
              {activeEndpoint === 'analyze' && curlAnalyze}
              {activeEndpoint === 'generateVariant' && curlVariant}
              {activeEndpoint === 'generateAsset' && curlAsset}
              {activeEndpoint === 'openapi' && `curl "${window.location.origin}/api/v1/design-system/openapi.json"`}
            </pre>
          </div>

          {/* Response Payload Viewer */}
          <div className="p-4 bg-[#07080C] min-h-[220px] max-h-96 overflow-y-auto font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
              <span>LIVE SERVER RESPONSE [HTTP 200]</span>
              {testResponse && <span>{testResponse.length} BYTES</span>}
            </div>

            {testResponse ? (
              <pre className="text-emerald-300 text-[11px] leading-relaxed">
                {testResponse}
              </pre>
            ) : (
              <div className="text-slate-600 italic py-10 text-center">
                Click "Run Request" above to test the live backend route with active system tokens.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Prompts & Rules Integration Guide */}
      <div className="p-6 rounded-2xl bg-[#10121A] border border-[#1E2333]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h4 className="font-heading text-base font-bold text-white tracking-tight">
            How to Feed This Design System into AI Coding Agents
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-slate-400">
          <div className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <h5 className="font-semibold text-white font-mono mb-1">1. Cursor (.cursorrules)</h5>
            <p className="leading-relaxed">
              Click "Copy Agent System Prompt" and paste into your project's root <code className="text-indigo-300">.cursorrules</code> file. 
              Cursor will automatically format all AI-generated code with your exact colors and typography.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <h5 className="font-semibold text-white font-mono mb-1">2. Figma Tokens Studio</h5>
            <p className="leading-relaxed">
              Export the <code className="text-indigo-300">tokens.json</code> package and load it into the Tokens Studio 
              for Figma plugin. Syncs instant styles and component variables into your Figma canvases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <h5 className="font-semibold text-white font-mono mb-1">3. Automated CI/CD Agents</h5>
            <p className="leading-relaxed">
              Automated pipelines can query <code className="text-indigo-300">/api/v1/design-system/generate-variant</code> via REST to generate 
              component PRs whenever design changes are merged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
