import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://openrouter.ai/api/v1';
const REQUEST_TIMEOUT_MS = 180_000;

export const TEXT_MODEL = process.env.OPENROUTER_TEXT_MODEL || 'google/gemini-3.8-flash';
export const IMAGE_MODEL = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-nano-banana-2.1';

/**
 * The route schemas were written against the Gemini SDK's `Type` enum. OpenRouter
 * speaks plain JSON Schema, whose type names are lowercase, so this keeps every
 * schema literal in `server.ts` untouched while emitting valid JSON Schema.
 */
export const Type = {
  OBJECT: 'object',
  STRING: 'string',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
  NUMBER: 'number',
  NULL: 'null',
} as const;

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface ChatJsonOptions {
  system: string;
  user: string | ContentPart[];
  schema: Record<string, unknown>;
  schemaName?: string;
  model?: string;
  temperature?: number;
}

export interface ImageOptions {
  prompt: string;
  referenceImageUrl?: string;
  aspectRatio?: string;
  resolution?: string;
  model?: string;
}

export class OpenRouterError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'OpenRouterError';
    this.status = status;
  }
}

export function createClient(apiKey: string) {
  return {
    async chatJson(options: ChatJsonOptions): Promise<any> {
      return chatJson(apiKey, options);
    },
    async generateImage(options: ImageOptions): Promise<string> {
      return generateImage(apiKey, options);
    },
  };
}

export type OpenRouterClient = ReturnType<typeof createClient>;

async function post(apiKey: string, path: string, body: unknown): Promise<Response> {
  try {
    return await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://syntax.local',
        'X-Title': 'SYNTAX Design System Workbench',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error: any) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new OpenRouterError(504, 'openrouter did not answer in time.');
    }
    throw new OpenRouterError(0, `fetch failed: ${error?.message ?? error}`);
  }
}

async function describeFailure(response: Response): Promise<string> {
  const raw = await response.text();
  try {
    const parsed = JSON.parse(raw);
    const message = parsed?.error?.message ?? parsed?.message ?? raw;
    return String(message);
  } catch {
    return raw || `HTTP ${response.status}`;
  }
}

async function chatJson(apiKey: string, options: ChatJsonOptions): Promise<any> {
  const messages = [
    { role: 'system', content: options.system },
    {
      role: 'user',
      content:
        typeof options.user === 'string'
          ? options.user
          : options.user.map((part) => part),
    },
  ];

  const baseBody = {
    model: options.model || TEXT_MODEL,
    messages,
    temperature: options.temperature ?? 0.2,
  };

  const schemaName = options.schemaName || 'structured_response';
  let response = await post(apiKey, '/chat/completions', {
    ...baseBody,
    response_format: {
      type: 'json_schema',
      json_schema: { name: schemaName, schema: options.schema },
    },
  });

  // Some providers behind OpenRouter reject json_schema. Retry in plain JSON
  // mode with the schema spelled out in the system prompt so the shape survives.
  if (!response.ok && response.status === 400) {
    const detail = await describeFailure(response);
    if (/response_format|json_schema|structured/i.test(detail)) {
      response = await post(apiKey, '/chat/completions', {
        ...baseBody,
        messages: [
          {
            role: 'system',
            content: `${options.system}\n\nRespond with JSON matching this schema exactly:\n${JSON.stringify(
              options.schema
            )}`,
          },
          ...messages.slice(1),
        ],
        response_format: { type: 'json_object' },
      });
    } else {
      throw new OpenRouterError(response.status, detail);
    }
  }

  if (!response.ok) {
    throw new OpenRouterError(response.status, await describeFailure(response));
  }

  const payload: any = await response.json();
  if (payload?.error) {
    throw new OpenRouterError(payload.error.code ?? 500, String(payload.error.message ?? 'openrouter error'));
  }

  const choice = payload?.choices?.[0];
  const text = extractText(choice?.message?.content);
  if (!text) {
    throw new OpenRouterError(502, 'openrouter returned an empty response.');
  }

  try {
    return parseJsonLoose(text);
  } catch (error) {
    if (choice?.finish_reason === 'length') {
      throw new OpenRouterError(502, 'the model hit its output limit before finishing the JSON.');
    }
    throw new OpenRouterError(502, 'the model returned malformed JSON.');
  }
}

async function generateImage(apiKey: string, options: ImageOptions): Promise<string> {
  const body: Record<string, unknown> = {
    model: options.model || IMAGE_MODEL,
    prompt: options.prompt,
    aspect_ratio: options.aspectRatio || '1:1',
    resolution: options.resolution === '2K' ? '2K' : '1K',
  };

  if (options.referenceImageUrl) {
    body.input_references = [{ type: 'image_url', image_url: { url: options.referenceImageUrl } }];
  }

  const response = await post(apiKey, '/images', body);
  if (!response.ok) {
    throw new OpenRouterError(response.status, await describeFailure(response));
  }

  const payload: any = await response.json();
  const image = payload?.data?.[0];
  const base64 = image?.b64_json;
  if (!base64) {
    throw new OpenRouterError(502, 'the image model returned no image data.');
  }

  const mediaType = image?.media_type || 'image/png';
  return `data:${mediaType};base64,${base64}`;
}

/** Chat completions return a string, or an array of typed parts. Flatten both. */
function extractText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part: any) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }
  return '';
}

/** Models sometimes wrap JSON in fences or a sentence. Recover what we can. */
function parseJsonLoose(text: string): any {
  const trimmed = text.trim();

  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch {
    const start = withoutFence.indexOf('{');
    const end = withoutFence.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(withoutFence.slice(start, end + 1));
    }
    throw new Error('no JSON object found in response');
  }
}

/** Turns a base64 payload plus mime type into the data URL the chat API expects. */
export function toDataUrl(mimeType: string, base64: string): string {
  return `data:${mimeType};base64,${base64}`;
}
