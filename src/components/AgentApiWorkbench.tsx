import React, { useState } from 'react';
import { Copy, Check, Play, ArrowRight } from 'lucide-react';
import { DesignSystem } from '../types/designSystem';

interface AgentApiWorkbenchProps {
  system: DesignSystem;
  onEngineActivity?: () => void;
}

export const AgentApiWorkbench: React.FC<AgentApiWorkbenchProps> = ({ system, onEngineActivity }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<
    'analyze' | 'generateVariant' | 'generateAsset' | 'openapi'
  >('analyze');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
${system.colors.palette
  .slice(0, 6)
  .map((c) => `- ${c.name}: ${c.hex} (${c.role})`)
  .join('\n')}

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
        const res = await fetch('/api/health');
        const json = await res.json();
        setTestResponse(JSON.stringify(json, null, 2));
      }
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
      onEngineActivity?.();
    }
  };

  // analyze needs an image and generate-asset needs a prompt; neither has a safe
  // default to send from here, so those rows explain themselves instead of
  // firing a different endpoint and pretending it was the one you picked.
  const runnable = activeEndpoint === 'generateVariant' || activeEndpoint === 'openapi';

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

  const minimalSystem = JSON.stringify({
    identity: { name: system.identity.name, mode: system.identity.mode },
    colors: { surfaces: system.colors.surfaces },
  });

  const curlVariant = `curl -X POST "${window.location.origin}/api/v1/design-system/generate-variant" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Interactive audio playback scrubber with volume slider",
    "designSystem": ${minimalSystem}
  }'`;

  const curlAsset = `curl -X POST "${window.location.origin}/api/v1/design-system/generate-asset" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "3D kinetic obsidian crystal core",
    "designSystem": ${minimalSystem},
    "assetType": "ui-artifact",
    "aspectRatio": "1:1",
    "imageSize": "1K"
  }'`;

  const endpoints = [
    {
      id: 'analyze',
      method: 'post',
      path: '/api/v1/design-system/analyze',
      desc: 'read screenshots into tokens and components',
    },
    {
      id: 'generateVariant',
      method: 'post',
      path: '/api/v1/design-system/generate-variant',
      desc: 'grow a component from the active tokens',
    },
    {
      id: 'generateAsset',
      method: 'post',
      path: '/api/v1/design-system/generate-asset',
      desc: 'render a visual asset in the system palette',
    },
    {
      id: 'openapi',
      method: 'get',
      path: '/api/v1/design-system/openapi.json',
      desc: 'the openapi 3.1 schema for agents',
    },
  ];

  const activeCurl =
    activeEndpoint === 'analyze'
      ? curlAnalyze
      : activeEndpoint === 'generateVariant'
      ? curlVariant
      : activeEndpoint === 'generateAsset'
      ? curlAsset
      : `curl "${window.location.origin}/api/v1/design-system/openapi.json"`;

  return (
    <div className="space-y-14">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="eyebrow">agent api</div>
          <h2 className="serif text-[2rem] sm:text-[2.5rem] leading-[1.12] mt-4">
            The same system, for machines.
          </h2>
          <p className="measure mt-4 text-[14px] leading-[1.75] text-[var(--ink-soft)]">
            Hand the active tokens to Cursor, Claude Code, Copilot or a pipeline of your own.
            Copy the system prompt, or call the endpoints directly.
          </p>
        </div>

        <button
          onClick={() => copyText(generateAgentSystemPrompt(), 'agent-prompt')}
          className="btn-primary shrink-0 self-start md:self-auto"
        >
          {copiedKey === 'agent-prompt' ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>copy agent prompt</span>
            </>
          )}
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-3">endpoints</div>
          <div className="border-t border-[var(--rule)]">
            {endpoints.map((ep) => {
              const isActive = activeEndpoint === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => setActiveEndpoint(ep.id as any)}
                  className={`w-full text-left py-3.5 pl-3 -ml-3 border-b border-[var(--rule)] border-l-2 transition-colors ${
                    isActive ? 'border-l-[var(--lichen)]' : 'border-l-transparent'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-2">
                    <span className="mono text-[9px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
                      {ep.method}
                    </span>
                    <span
                      className={`mono text-[10.5px] truncate transition-colors ${
                        isActive ? 'text-[var(--lichen)]' : 'text-[var(--ink)]'
                      }`}
                    >
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[var(--ink-soft)] mt-1">{ep.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 card overflow-hidden">
          <div className="p-4 border-b border-[var(--rule)] flex items-center justify-between gap-3 bg-[var(--paper)]">
            <span className="eyebrow">console</span>

            <div className="flex items-center gap-4">
              <button
                onClick={() => copyText(activeCurl, 'curl')}
                className="btn-quiet text-[11px]"
              >
                {copiedKey === 'curl' ? (
                  <Check className="w-3 h-3 text-[var(--lichen)]" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>copy curl</span>
              </button>

              <button
                onClick={handleTestCall}
                disabled={isCallingApi || !runnable}
                title={
                  runnable
                    ? 'send this request'
                    : 'this endpoint needs an image or prompt — use the workbench instead'
                }
                className="btn-secondary text-[11px] py-1.5 px-3"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isCallingApi ? 'running' : runnable ? 'run request' : 'needs input'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-[var(--ground-deep)] border-b border-[var(--rule)] overflow-x-auto quiet-scroll">
            <pre className="mono text-[10.5px] leading-[1.7] text-[var(--ink-soft)]">
              {activeCurl}
            </pre>
          </div>

          <div className="p-4 bg-[var(--paper)] min-h-[220px] max-h-96 overflow-auto quiet-scroll">
            <div className="flex items-center justify-between mono text-[9.5px] text-[var(--ink-faint)] mb-2">
              <span>response</span>
              {testResponse && (
                <span>{new Blob([testResponse]).size.toLocaleString()} bytes</span>
              )}
            </div>

            {testResponse ? (
              <pre className="mono text-[10.5px] leading-[1.75] text-[var(--ink-soft)]">
                {testResponse}
              </pre>
            ) : (
              <p className="text-[12px] italic text-[var(--ink-faint)] py-8">
                {runnable
                  ? 'Run a request to see the live response. It will appear here.'
                  : 'This call needs a screenshot or a prompt. Run it from the workbench, or paste the curl somewhere with real input.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-[var(--rule)] pt-8">
        <div className="eyebrow">how to use it</div>
        <h4 className="serif text-[24px] mt-2">Feed it to an agent.</h4>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              n: '01',
              title: 'Cursor rules',
              body: 'Copy the agent prompt and paste it into .cursorrules at the root of a project. New code will fall into place.',
            },
            {
              n: '02',
              title: 'Figma tokens',
              body: 'Export tokens.json and load it into Tokens Studio. The palette and scale arrive as variables.',
            },
            {
              n: '03',
              title: 'Automated pipelines',
              body: 'Call generate-variant over REST whenever a design change lands. Your CI can open the pull request.',
            },
          ].map((item) => (
            <div key={item.n} className="border-t border-[var(--rule)] pt-4">
              <div className="mono text-[10px] text-[var(--ink-faint)]">{item.n}</div>
              <h5 className="serif text-[18px] mt-1.5">{item.title}</h5>
              <p className="text-[12.5px] leading-[1.7] text-[var(--ink-soft)] mt-1.5">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
