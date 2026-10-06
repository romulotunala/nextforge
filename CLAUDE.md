# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`nextforge` is an open-source boilerplate for **static institutional sites** built with Next.js 16
(App Router), React 19, strict TypeScript and SCSS Modules, deployed to GitHub Pages. Docs, UI copy,
code comments and validation messages are written in **Brazilian Portuguese** — keep new user-facing
text and comments in pt-BR.

Requires Node >= 24 and pnpm 11 (`packageManager` is pinned in `package.json`).

## Commands

```bash
pnpm dev                  # dev server at http://localhost:3000
pnpm build                # static export to out/
pnpm lint                 # ESLint + Stylelint (src/**/*.scss)
pnpm lint:fix
pnpm test                 # Vitest unit tests (src/**/*.{test,spec}.{ts,tsx})
pnpm build && pnpm test:e2e   # Playwright; serves the built out/ dir, so build first
```

Single test: `pnpm exec vitest run src/tests/Button.test.tsx` (or `-t "<name>"`);
`pnpm exec playwright test e2e/home.spec.ts -g "<name>"`.

CI (`.github/workflows/deploy.yml`, on push to `main`) runs lint → test → build, then deploys `out/`
to Pages. E2E tests are **not** run in CI.

## Architecture

- **Static export only.** `next.config.ts` sets `output: 'export'`, `images.unoptimized`, and a
  production-only `basePath` of `/${repoName}` for GitHub Pages. Nothing that needs a server
  (route handlers, SSR, middleware, server actions, `next/image` optimization) will work. Routes
  like `src/app/sitemap.ts` need `export const dynamic = 'force-static'`.
  Note: Playwright serves `out/` at the root (`serve out -p 3000`) while production builds prefix
  assets with `/nextforge`, so be aware of basePath when debugging e2e failures.
- **Content is separated from components.** Copy lives in `src/content/home.ts` as `as const`
  objects; section components in `src/components/sections/` import it and use it as prop
  defaults (e.g. `Hero` accepts overrides but falls back to `heroContent`). `src/app/page.tsx`
  just composes the sections. Reusable primitives go in `src/components/ui/`.
- **Domain logic lives in `src/lib/`**, not in components. `src/lib/contact-form.ts` holds the zod
  schema (imported from `zod/v4`), default values, labels, Formspree endpoint validation and
  Formspree error-message mapping; `Contact.tsx` (the only client component) wires it up with
  react-hook-form. Unit tests target these lib functions directly.
- **Contact form** posts client-side to `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (see `.env.example`;
  in CI it comes from the repo variable of the same name). Without it the form runs in "demo mode"
  with submit disabled.
- **Styling:** SCSS + CSS Modules only — no Tailwind or utility classes. Each component has a
  sibling `*.module.scss` that does `@use '../../styles/abstracts/variables' as *;` (and `mixins`)
  for design tokens (`$spacing-*`, `$color-*`, `$font-size-*`) and mixins (`container`, `flex`,
  `focus-ring`). Global styles enter via `src/styles/globals.scss` imported in `layout.tsx`.
  Class names are camelCase. `src/app/globals.css` and `src/app/page.module.css` are unused
  create-next-app leftovers.
- **Path alias:** `@/*` → `src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
- Vitest runs in jsdom with globals and `@testing-library/jest-dom` (`src/tests/setup.ts`); CSS
  Modules use `non-scoped` class names in tests, so `styles.foo` resolves to `foo`.

## Conventions

- Formatting is enforced by ESLint `@stylistic` (no Prettier): 2-space indent, single quotes
  (including JSX attributes), semicolons, trailing commas on multiline, max 100 chars, final
  newline. Long strings are split with leading `+` concatenation.
- Commits must follow Conventional Commits (commitlint via Husky `commit-msg`); `pre-commit` runs
  lint-staged (`eslint --fix` / `stylelint --fix`).
- Per-project customization points: `src/content/home.ts`, metadata in `src/app/layout.tsx`,
  `repoName` in `next.config.ts`, tokens in `src/styles/abstracts/_variables.scss`.
- `PLANO-BOILERPLATE.md` is the original spec/plan for the boilerplate (some items, e.g.
  lucide-react, are planned but not installed).
