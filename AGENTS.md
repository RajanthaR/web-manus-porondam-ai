# AGENTS.md — web-manus-porondam-ai

## What This App Is

Porondam.ai is a Sri Lankan horoscope-matching platform: users upload horoscope chart images, a vision LLM extracts birth details/planetary positions, traditional 20-Porondam matching scores compatibility between two charts, and results can be saved to a user dashboard. Includes a Learn page for reference (nakshatras, rashis, porondam meanings).

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.9, Vite 7, Tailwind CSS 4, shadcn/ui (Radix primitives), wouter (routing), TanStack Query, framer-motion
- **Backend**: Express, tRPC v11, Drizzle ORM + MySQL, jose (JWT), `invokeLLM` (vision) via Manus platform API, AWS S3 SDK (image storage)
- **Tooling**: pnpm (required — `pnpm-lock.yaml` + patched deps), Vitest, Prettier, esbuild, tsx

## Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies (pnpm only) |
| `pnpm dev` | Dev server (`tsx watch server/_core/index.ts`) — app + API at http://localhost:3000 |
| `pnpm build` | `vite build` + esbuild server bundle → `dist/` |
| `pnpm start` | Production server (`NODE_ENV=production node dist/index.js`) |
| `pnpm check` | TypeScript type check |
| `pnpm test` | Vitest suite |
| `pnpm format` | Prettier write |
| `pnpm db:push` | `drizzle-kit generate && drizzle-kit migrate` |

Prerequisites: Node 18+, pnpm, MySQL with `.env` (see below).

## Environment Variables

**There is no `.env.example`** — create `.env` manually. At minimum:

- `DATABASE_URL` — MySQL connection string (required)
- `JWT_SECRET` — session signing
- `VITE_APP_ID` / `OAUTH_SERVER_URL` / `OWNER_OPEN_ID` / `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY` — Manus platform (OAuth + vision LLM, consumed in `server/_core/env.ts`)
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_S3_BUCKET` — chart image storage

Never commit `.env`.

## Architecture & Directory Map

```
client/src/
  main.tsx / App.tsx           Entry + wouter routes
  pages/                       Home, Match, Dashboard, Learn, ComponentShowcase, NotFound
  components/ui/               shadcn primitives (generated — compose, don't hand-edit)
  _core/hooks/useAuth.ts       Auth hook (framework)
  lib/trpc.ts                  tRPC client
server/
  _core/                       Manus framework (index, trpc, oauth, llm, env) — DO NOT MODIFY
  routers.ts                   tRPC: auth (me/logout),
                               horoscope (processImage/updateChart/myCharts/getChart),
                               matching (calculate/history/getResult/deleteResult),
                               reference (nakshatras/rashis/porondamInfo)
  horoscopeProcessor.ts        Vision LLM extraction from chart images (invokeLLM)
  astrology.ts                 NAKSHATRAS/RASHIS tables + Porondam scoring logic
  db.ts                        Drizzle queries
  storage.ts                   S3 helpers
  *.test.ts                    astrology, auth.logout tests
drizzle/
  schema.ts                    Tables: users, horoscopeCharts, matchingResults
  relations.ts, migrations/    Generated migrations (0000–0001)
docs/API.md, docs/DEPLOYMENT.md, docs/README.md
todo.md
patches/wouter@3.7.1.patch     Applied via pnpm patchedDependencies — do not delete
```

**Data flow**: image upload → `horoscope.processImage` → vision LLM (`invokeLLM`) → chart record; `matching.calculate` runs Porondam scoring in `astrology.ts` → `matchingResults` row. Reference data served from hard-coded tables.

## Where to Make Changes (Conventions)

- **Matching/scoring logic**: `server/astrology.ts` (NAKSHATRAS, RASHIS, porondam weights)
- **Chart extraction**: `server/horoscopeProcessor.ts` (prompt + response parsing)
- **New API procedure**: `server/routers.ts` + queries in `server/db.ts`; schema in `drizzle/schema.ts` then `pnpm db:push`
- **New page**: `client/src/pages/` + wouter route in `client/src/App.tsx`
- **`server/_core/` and `client/src/_core/` are Manus framework code — do not modify**
- **Do NOT delete `patches/wouter@3.7.1.patch`**

## Testing

Vitest (`pnpm test`): `server/astrology.test.ts` (nakshatra/rashi/porondam scoring), `auth.logout.test.ts` (plus `vitest.config.ts`).

## Build & Deploy

`pnpm build` → `dist/`; `pnpm start` serves production. Apply `pnpm db:push` first — see `docs/DEPLOYMENT.md`.

## Repo-Specific Notes

- Chart extraction quality depends on the vision-LLM prompt in `horoscopeProcessor.ts` — validate changes against real chart images
- Bilingual content (Sinhala/English) lives in UI code and reference tables
