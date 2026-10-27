# syntax

Design system reverse-engineering and synthesis workbench. Deconstructs UI screenshots into structured token hierarchies, modular typography scales, spatial grids, and component specifications.

## Architecture

- **Multimodal Extraction Server (`server.ts`)**: Express backend that accepts UI captures and runs structured schema extraction via `@google/genai` to infer color tokens, WCAG contrast pairings, font scales, and layout primitives.
- **Interactive Workbench (`src/components/`)**:
  - `ColorTokensView` & `TypographyMatrixView`: Inspect and edit extracted color ramps and type scales.
  - `ComponentsCatalogView` & `InteractiveComponentPreview`: Live preview of synthesized UI primitives against extracted tokens.
  - `ExportDrawer`: Exports W3C Design Tokens Community Group (DTCG) JSON, CSS custom properties, and React/Tailwind scaffolds.
  - `AgentApiWorkbench`: Local endpoint inspector for programmatic design-token queries.

## Quickstart

```bash
npm install
cp .env.example .env   # set GEMINI_API_KEY
npm run dev            # starts Express + Vite workbench on http://localhost:3000
```

## Verification

```bash
npm run lint           # TypeScript typecheck (tsc --noEmit)
npm run build          # production Vite bundle
```
