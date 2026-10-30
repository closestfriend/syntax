# syntax

Read the system inside a screen.

Bring one or more UI screenshots. Syntax takes them apart into color tokens, a modular
type scale, spatial rhythm, DTCG tokens, and React/Vue components you can ship as-is.
Export the tokens, or query them over the local API and let an agent build with them.

## how it's put together

- `server.ts` — express backend. accepts the captures, asks a vision model for the token
  hierarchy, and checks the answer against a schema.
- `openrouter.ts` — the only file that talks to a provider. text and image models both
  route through openrouter, and both are swappable from `.env`.
- `src/components/` — the workbench:
  - `ColorTokensView`, `TypographyMatrixView` — read and adjust the extracted ramps and scale.
  - `ComponentsCatalogView`, `InteractiveComponentPreview` — preview synthesized primitives
    against the live tokens.
  - `ExportDrawer` — DTCG json, css custom properties, tailwind scaffold.
  - `AgentApiWorkbench` — inspect the local endpoints.

## running it

```bash
bun install
cp .env.example .env    # add your openrouter key
bun run dev             # express + vite on http://localhost:3000
```

## checks

```bash
bun run lint    # tsc --noEmit
bun run build   # production bundle
```
