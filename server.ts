import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for parsing large JSON payloads (screenshots can be up to ~15-20MB base64)
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Initialize Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'operational',
      hasApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
      version: '1.0.0-syntax-core',
    });
  });

  // OpenAPI Specification for AI Agents & Developers
  app.get('/api/v1/design-system/openapi.json', (req: Request, res: Response) => {
    res.json({
      openapi: '3.1.0',
      info: {
        title: 'SYNTAX Design System Synthesis API',
        version: '1.0.0',
        description:
          'Autonomous machine-to-machine and developer API for reverse-engineering UI screenshots into W3C DTCG Design Tokens, Tailwind configurations, and React/Vue component libraries.',
      },
      paths: {
        '/api/v1/design-system/analyze': {
          post: {
            summary: 'Deconstruct UI screenshots into design tokens and component specifications',
            operationId: 'analyzeUiScreenshots',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            base64: { type: 'string', description: 'Base64 image string with or without data: URL prefix' },
                            mimeType: { type: 'string', default: 'image/png' },
                            name: { type: 'string' },
                          },
                          required: ['base64'],
                        },
                      },
                      brandContext: {
                        type: 'string',
                        description: 'Optional brand ethos, target audience, or design system naming guidance',
                      },
                    },
                    required: ['images'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Full synthesized design system package',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/DesignSystemPackage' },
                  },
                },
              },
            },
          },
        },
        '/api/v1/design-system/generate-variant': {
          post: {
            summary: 'Synthesize a new component variant aligned with an existing token system',
            operationId: 'generateComponentVariant',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      prompt: { type: 'string', description: 'Description of the requested component' },
                      designSystem: { type: 'object', description: 'Active design system tokens and theme' },
                    },
                    required: ['prompt', 'designSystem'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Generated component code in React, Vue, and Web Component formats',
              },
            },
          },
        },
        '/api/v1/design-system/generate-asset': {
          post: {
            summary: 'Generate a design-system-aligned visual image asset via gemini-nano-banana-2.1 and Gemini LLM prompt inference',
            operationId: 'generateDesignAsset',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      prompt: { type: 'string', description: 'User input concept or asset description' },
                      designSystem: { type: 'object', description: 'Active design system token specification' },
                      assetType: { type: 'string', description: 'hero, ui-card, badge-icon, 3d-artifact, texture-pattern, marketing' },
                      aspectRatio: { type: 'string', default: '1:1', enum: ['1:1', '16:9', '9:16', '3:4', '4:3', '1:4', '4:1'] },
                      imageSize: { type: 'string', default: '1K', enum: ['1K', '2K'] },
                    },
                    required: ['prompt', 'designSystem'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Generated image asset with base64 data and design system alignment rationale',
              },
            },
          },
        },
        '/api/v1/design-system/edit-asset': {
          post: {
            summary: 'Edit an existing visual asset adhering to design system tokens with gemini-nano-banana-2.1',
            operationId: 'editDesignAsset',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      base64: { type: 'string', description: 'Base64 image to edit' },
                      mimeType: { type: 'string', default: 'image/png' },
                      editInstruction: { type: 'string', description: 'Requested modifications' },
                      designSystem: { type: 'object', description: 'Active design system token specification' },
                      aspectRatio: { type: 'string', default: '1:1' },
                      imageSize: { type: 'string', default: '1K' },
                    },
                    required: ['base64', 'editInstruction', 'designSystem'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Modified image asset adhering to design system rules',
              },
            },
          },
        },
      },
    });
  });

  // POST /api/v1/design-system/analyze
  app.post('/api/v1/design-system/analyze', async (req: Request, res: Response): Promise<void> => {
    try {
      if (!ai) {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
        return;
      }

      const { images, brandContext } = req.body;

      if (!images || !Array.isArray(images) || images.length === 0) {
        res.status(400).json({ error: 'Please provide at least one screenshot image in the `images` array.' });
        return;
      }

      // Convert images to Gemini parts
      const imageParts = images.map((img: { base64: string; mimeType?: string }) => {
        let cleanBase64 = img.base64;
        let mime = img.mimeType || 'image/png';

        if (cleanBase64.includes(';base64,')) {
          const parts = cleanBase64.split(';base64,');
          const header = parts[0];
          mime = header.replace('data:', '') || mime;
          cleanBase64 = parts[1];
        }

        return {
          inlineData: {
            mimeType: mime,
            data: cleanBase64,
          },
        };
      });

      const systemInstruction = `You are an elite Creative Director and Design Systems Architect (combining the rigors of Pentagram, Collins, and Awwwards-winning digital studios like Locomotive and Active Theory).
Analyze the provided UI screenshot(s) with clinical precision. Reverse-engineer its visual identity, token architecture, and component library.
Deconstruct every visual decision into mathematical and aesthetic tokens:
1. Brand & Aesthetic Architecture: Name, archetype, visual ethos, contrast strategy, mood.
2. Color Tokens: Hex, RGB, HSL, OKLCH, WCAG AA compliance score against surface/canvas, semantic role (primary, secondary, accent, canvas, surface, elevated, text-primary, text-secondary, text-muted, border, error, success, warning).
3. Typography Scale: Detected/suggested font families (sans, serif, mono), modular scale ratio, font sizes, line heights, letter spacings, weights.
4. Spatial & Elevation: Spacing scale (4px/8px increments), border-radii, elevation shadows (ambient + key, or brutalist hard offset), motion easing curves.
5. Detected Components: At least 5-6 core components found or implied in the UI (e.g. Primary Button, Secondary Button, Filter Badge, Stat/Metric Card, Input Field, Modal/Drawer Header, Toggle Switch).
For each component, provide:
- Component name and description
- Clean, semantic, fully working React (TypeScript + Tailwind CSS classes) code snippet
- Matching Vue 3 (Composition API <script setup> + Tailwind) code snippet
- Matching HTML/Web Component snippet
- W3C DTCG / Figma Tokens path

Return ONLY valid JSON strictly complying with the requested schema.`;

      const promptText = `Perform a comprehensive design system reverse-engineering of this UI screenshot${
        images.length > 1 ? ' set' : ''
      }.
${brandContext ? `Brand/System notes from user: "${brandContext}"` : ''}

Ensure all colors are extracted directly from the actual pixels in the screenshots, with realistic hex codes, exact semantic groupings, and accessible text contrasts.
Provide production-ready, clean, responsive React and Vue 3 component implementations that use Tailwind classes reflecting these exact tokens.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [...imageParts, { text: promptText }],
        },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              identity: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  slug: { type: Type.STRING },
                  archetype: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  description: { type: Type.STRING },
                  visualEthos: { type: Type.ARRAY, items: { type: Type.STRING } },
                  mode: { type: Type.STRING, description: 'dark, light, or adaptive' },
                },
                required: ['name', 'slug', 'archetype', 'tagline', 'description', 'visualEthos', 'mode'],
              },
              colors: {
                type: Type.OBJECT,
                properties: {
                  palette: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING, description: 'brand, neutral, semantic, surface, accent' },
                        hex: { type: Type.STRING },
                        rgb: { type: Type.STRING },
                        hsl: { type: Type.STRING },
                        role: { type: Type.STRING },
                        contrastRatio: { type: Type.STRING },
                        wcagPass: { type: Type.BOOLEAN },
                        figmaTokenPath: { type: Type.STRING },
                      },
                      required: ['name', 'category', 'hex', 'role', 'figmaTokenPath'],
                    },
                  },
                  surfaces: {
                    type: Type.OBJECT,
                    properties: {
                      canvas: { type: Type.STRING },
                      surface: { type: Type.STRING },
                      elevated: { type: Type.STRING },
                      border: { type: Type.STRING },
                      textPrimary: { type: Type.STRING },
                      textSecondary: { type: Type.STRING },
                      textMuted: { type: Type.STRING },
                    },
                    required: ['canvas', 'surface', 'elevated', 'border', 'textPrimary', 'textSecondary'],
                  },
                },
                required: ['palette', 'surfaces'],
              },
              typography: {
                type: Type.OBJECT,
                properties: {
                  fontFamilies: {
                    type: Type.OBJECT,
                    properties: {
                      sans: { type: Type.STRING },
                      display: { type: Type.STRING },
                      mono: { type: Type.STRING },
                    },
                    required: ['sans', 'display'],
                  },
                  scaleRatio: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        size: { type: Type.STRING },
                        lineHeight: { type: Type.STRING },
                        letterSpacing: { type: Type.STRING },
                        weight: { type: Type.STRING },
                        sampleText: { type: Type.STRING },
                        cssClass: { type: Type.STRING },
                      },
                      required: ['name', 'size', 'lineHeight', 'weight', 'cssClass'],
                    },
                  },
                },
                required: ['fontFamilies', 'scaleRatio', 'steps'],
              },
              spatial: {
                type: Type.OBJECT,
                properties: {
                  gridBase: { type: Type.STRING },
                  spacingScale: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        token: { type: Type.STRING },
                        pixels: { type: Type.STRING },
                        rem: { type: Type.STRING },
                      },
                      required: ['token', 'pixels', 'rem'],
                    },
                  },
                  radii: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        token: { type: Type.STRING },
                        value: { type: Type.STRING },
                        role: { type: Type.STRING },
                      },
                      required: ['token', 'value', 'role'],
                    },
                  },
                  shadows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        token: { type: Type.STRING },
                        value: { type: Type.STRING },
                        style: { type: Type.STRING },
                      },
                      required: ['token', 'value'],
                    },
                  },
                  motion: {
                    type: Type.OBJECT,
                    properties: {
                      easingDefault: { type: Type.STRING },
                      durationQuick: { type: Type.STRING },
                      durationStandard: { type: Type.STRING },
                      durationDeliberate: { type: Type.STRING },
                    },
                    required: ['easingDefault', 'durationQuick', 'durationStandard'],
                  },
                },
                required: ['gridBase', 'spacingScale', 'radii', 'shadows', 'motion'],
              },
              components: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    reactCode: { type: Type.STRING },
                    vueCode: { type: Type.STRING },
                    htmlCode: { type: Type.STRING },
                    figmaTokens: { type: Type.STRING },
                    props: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          type: { type: Type.STRING },
                          default: { type: Type.STRING },
                          description: { type: Type.STRING },
                        },
                        required: ['name', 'type'],
                      },
                    },
                  },
                  required: ['id', 'name', 'category', 'description', 'reactCode', 'vueCode'],
                },
              },
            },
            required: ['identity', 'colors', 'typography', 'spatial', 'components'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsedData = JSON.parse(responseText);

      res.json({
        success: true,
        data: parsedData,
        meta: {
          analyzedScreenshotsCount: images.length,
          generatedAt: new Date().toISOString(),
          model: 'gemini-3.8-flash',
        },
      });
    } catch (error: any) {
      console.error('Error in /api/v1/design-system/analyze:', error);
      res.status(500).json({
        error: error.message || 'An error occurred while analyzing the UI screenshots with Gemini.',
      });
    }
  });

  // POST /api/v1/design-system/generate-variant
  app.post('/api/v1/design-system/generate-variant', async (req: Request, res: Response): Promise<void> => {
    try {
      if (!ai) {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
        });
        return;
      }

      const { prompt, designSystem } = req.body;

      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required to synthesize a component variation.' });
        return;
      }

      const systemInstruction = `You are a Lead Frontend Architect and Design System Specialist.
Generate a new reusable component that strictly conforms to the provided design system tokens, typography, colors, and visual ethos.
Provide:
1. Component name, id, category, and architecture rationale.
2. Production-grade React (TypeScript + Tailwind CSS) code.
3. Production-grade Vue 3 (<script setup> + Tailwind CSS) code.
4. Clean HTML + Tailwind markup.
5. Component props definition with types and defaults.
Return ONLY valid JSON matching the schema.`;

      const promptContext = `Design System Context:
Name: ${designSystem?.identity?.name || 'Custom System'}
Visual Ethos: ${JSON.stringify(designSystem?.identity?.visualEthos || [])}
Surfaces & Colors: ${JSON.stringify(designSystem?.colors?.surfaces || {})}
Palette Hexes: ${JSON.stringify(
        (designSystem?.colors?.palette || []).map((p: any) => ({ name: p.name, hex: p.hex, role: p.role }))
      )}
Radii: ${JSON.stringify(designSystem?.spatial?.radii || [])}
Font Sans: ${designSystem?.typography?.fontFamilies?.sans || 'Inter'}

User Request for New Component Variation:
"${prompt}"

Synthesize this component completely. It must look immaculate, highly polished, interactive, accessible, and 100% styled in harmony with the design system.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              designRationale: { type: Type.STRING },
              reactCode: { type: Type.STRING },
              vueCode: { type: Type.STRING },
              htmlCode: { type: Type.STRING },
              props: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    default: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ['name', 'type'],
                },
              },
            },
            required: ['id', 'name', 'category', 'description', 'reactCode', 'vueCode'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const variant = JSON.parse(responseText);

      res.json({
        success: true,
        data: variant,
      });
    } catch (error: any) {
      console.error('Error in /api/v1/design-system/generate-variant:', error);
      res.status(500).json({
        error: error.message || 'Failed to synthesize component variant.',
      });
    }
  });

  // POST /api/v1/design-system/generate-asset
  app.post('/api/v1/design-system/generate-asset', async (req: Request, res: Response): Promise<void> => {
    try {
      if (!ai) {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
        return;
      }

      const { prompt, designSystem, assetType, aspectRatio, imageSize } = req.body;

      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required to generate a design system visual asset.' });
        return;
      }

      // Step 1: Gemini LLM Inference (gemini-3.8-flash) to translate & infuse the user prompt with the active Design System
      const systemPromptInference = `You are an elite Creative Director and Design Systems Architect.
Analyze the user's asset prompt and rigorously translate it into a visual art direction prompt that strictly conforms to the active Design System's visual identity, palette, luminance, and spatial geometry.
Regardless of how informal, off-brand, or generic the user's input is, the synthesized prompt MUST:
- Enforce the exact palette hex codes and surface hierarchy (${designSystem?.colors?.surfaces?.canvas || '#090A0F'}, ${designSystem?.colors?.surfaces?.surface || '#11131B'}, and accents).
- Adopt the design system's aesthetic archetype: "${designSystem?.identity?.archetype || 'Minimalist Precision'}" and ethos: ${JSON.stringify(designSystem?.identity?.visualEthos || [])}.
- Direct the composition, lighting, materials (e.g. frosted architectural glass, anodized obsidian titanium, crisp brutalist paper), and typography posture.
- Avoid low-quality cliches or device bezels/laptop frames.
- Deliver a visually breathtaking, modern, professional graphic asset.`;

      const promptContext = `User Request for Asset: "${prompt}"
Requested Asset Role: ${assetType || 'ui-artifact'}
Target Design System:
- Name: ${designSystem?.identity?.name || 'Active System'}
- Mode: ${designSystem?.identity?.mode || 'dark'}
- Canvas Background: ${designSystem?.colors?.surfaces?.canvas || '#090A0F'}
- Surface: ${designSystem?.colors?.surfaces?.surface || '#11131B'}
- Border Stroke: ${designSystem?.colors?.surfaces?.border || '#23283B'}
- Key Palette Colors: ${(designSystem?.colors?.palette || []).slice(0, 8).map((c: any) => `${c.name} (${c.hex})`).join(', ')}

Return a JSON object with:
- synthesizedPrompt: Complete, evocative, detailed image prompt for the image generation model (explicitly citing color hues, lighting, and materials).
- designSystemAlignment: 1-2 concise sentences explaining which brand rules and tokens were enforced.
- appliedTokens: Array of strings representing the specific tokens woven into the prompt.
- assetTitle: A crisp 2-4 word title for this asset.`;

      const inferenceResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction: systemPromptInference,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synthesizedPrompt: { type: Type.STRING },
              designSystemAlignment: { type: Type.STRING },
              appliedTokens: { type: Type.ARRAY, items: { type: Type.STRING } },
              assetTitle: { type: Type.STRING },
            },
            required: ['synthesizedPrompt', 'designSystemAlignment', 'appliedTokens', 'assetTitle'],
          },
        },
      });

      const inferenceData = JSON.parse(inferenceResponse.text?.trim() || '{}');
      const synthesizedPrompt = inferenceData.synthesizedPrompt || prompt;

      // Step 2: High-Quality Image Generation with gemini-nano-banana-2.1
      const validAspectRatios = ['1:1', '16:9', '9:16', '3:4', '4:3', '1:4', '4:1', '1:8', '8:1'];
      const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';
      const targetImageSize = imageSize === '2K' ? '2K' : '1K';

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [{ text: synthesizedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: targetAspectRatio,
            imageSize: targetImageSize,
          },
        },
      });

      let imageUrl = '';
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) {
        throw new Error('Image generation completed, but no image data part was returned by gemini-nano-banana-2.1.');
      }

      res.json({
        success: true,
        data: {
          id: `ast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: inferenceData.assetTitle || 'Design System Asset',
          imageUrl,
          originalPrompt: prompt,
          synthesizedPrompt,
          designSystemAlignment: inferenceData.designSystemAlignment,
          appliedTokens: inferenceData.appliedTokens || [],
          aspectRatio: targetAspectRatio,
          imageSize: targetImageSize,
          assetType: assetType || 'ui-artifact',
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error('Error in /api/v1/design-system/generate-asset:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate visual asset with gemini-nano-banana-2.1.',
      });
    }
  });

  // POST /api/v1/design-system/edit-asset
  app.post('/api/v1/design-system/edit-asset', async (req: Request, res: Response): Promise<void> => {
    try {
      if (!ai) {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
        return;
      }

      const { base64, mimeType, editInstruction, designSystem, aspectRatio, imageSize, parentAssetId } = req.body;

      if (!base64 || !editInstruction) {
        res.status(400).json({ error: 'Both image base64 and editInstruction are required to edit an asset.' });
        return;
      }

      let cleanBase64 = base64;
      let mime = mimeType || 'image/png';
      if (cleanBase64.includes(';base64,')) {
        const parts = cleanBase64.split(';base64,');
        mime = parts[0].replace('data:', '') || mime;
        cleanBase64 = parts[1];
      }

      // Step 1: Gemini LLM Inference to translate edit instruction to align with design system
      const systemPromptInference = `You are a Lead Visual Designer and Design Systems Architect.
Translate the user's image editing instruction into a precise instruction for gemini-nano-banana-2.1.
Enforce the active design system's colors (${designSystem?.colors?.surfaces?.canvas || '#090A0F'}, ${designSystem?.colors?.surfaces?.surface || '#11131B'}, etc.), style archetype, and geometry.
Return JSON with synthesizedEditPrompt and designSystemAlignment.`;

      const promptContext = `Original Edit Instruction: "${editInstruction}"
Active Design System:
- Name: ${designSystem?.identity?.name || 'Active System'}
- Palette: ${(designSystem?.colors?.palette || []).slice(0, 6).map((c: any) => `${c.name}: ${c.hex}`).join(', ')}

Return JSON:
- synthesizedEditPrompt: Refined, brand-coherent modification prompt for the image editing model.
- designSystemAlignment: 1-2 sentences on how the tokens were maintained.
- appliedTokens: string array of tokens applied.`;

      const inferenceResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction: systemPromptInference,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synthesizedEditPrompt: { type: Type.STRING },
              designSystemAlignment: { type: Type.STRING },
              appliedTokens: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['synthesizedEditPrompt', 'designSystemAlignment', 'appliedTokens'],
          },
        },
      });

      const inferenceData = JSON.parse(inferenceResponse.text?.trim() || '{}');
      const synthesizedEditPrompt = inferenceData.synthesizedEditPrompt || editInstruction;

      // Step 2: Edit Image using gemini-nano-banana-2.1 with image + text parts
      const validAspectRatios = ['1:1', '16:9', '9:16', '3:4', '4:3', '1:4', '4:1', '1:8', '8:1'];
      const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';
      const targetImageSize = imageSize === '2K' ? '2K' : '1K';

      const editResponse = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mime,
              },
            },
            {
              text: synthesizedEditPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: targetAspectRatio,
            imageSize: targetImageSize,
          },
        },
      });

      let updatedImageUrl = '';
      for (const part of editResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          updatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!updatedImageUrl) {
        throw new Error('Image edit completed, but no image part was returned by gemini-nano-banana-2.1.');
      }

      res.json({
        success: true,
        data: {
          id: `ast_edit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: `Edited Variant of ${parentAssetId || 'Asset'}`,
          imageUrl: updatedImageUrl,
          originalPrompt: editInstruction,
          synthesizedPrompt: synthesizedEditPrompt,
          designSystemAlignment: inferenceData.designSystemAlignment,
          appliedTokens: inferenceData.appliedTokens || [],
          aspectRatio: targetAspectRatio,
          imageSize: targetImageSize,
          assetType: 'edited-variant',
          createdAt: new Date().toISOString(),
          parentAssetId,
        },
      });
    } catch (error: any) {
      console.error('Error in /api/v1/design-system/edit-asset:', error);
      res.status(500).json({
        error: error.message || 'Failed to edit visual asset with gemini-nano-banana-2.1.',
      });
    }
  });

  // Setup Vite in Dev or static files in Production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYNTAX SERVER] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
