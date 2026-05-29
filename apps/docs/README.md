# @madda/docs

Documentation site for [@madda/app](https://www.npmjs.com/package/@madda/app).

- **Stack:** [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)
- **Search:** [Pagefind](https://pagefind.app/) (free, static, no API key)
- **Locales:** English (default) + Português (BR) at `/pt-br/`

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/faq` | FAQ |
| `/docs/*` | Documentation (Starlight) |
| `/pt-br/*` | Portuguese LP, FAQ, and docs |

## Commands

```bash
pnpm dev          # http://localhost:4321
pnpm build        # output: dist/
pnpm preview      # serve dist locally
```

From monorepo root: `pnpm dev:docs` / `pnpm build:docs`.

## Deploy (Vercel)

Set **Root Directory** to `apps/docs`. Framework preset: Astro. Output: `dist`.
