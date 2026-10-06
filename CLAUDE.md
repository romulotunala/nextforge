# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Projeto

`nextforge` é um boilerplate open-source para **sites institucionais estáticos** feito com Next.js 16
(App Router), React 19, TypeScript estrito e SCSS Modules, publicado no GitHub Pages. Documentação,
textos da interface, comentários de código e mensagens de validação são escritos em **português do
Brasil** — mantenha novos textos voltados ao usuário e comentários em pt-BR.

Requer Node >= 24 e pnpm 11 (o `packageManager` está fixado no `package.json`).

## Comandos

```bash
pnpm dev                  # servidor de desenvolvimento em http://localhost:3000
pnpm build                # export estático para out/
pnpm lint                 # ESLint + Stylelint (src/**/*.scss)
pnpm lint:fix
pnpm typecheck            # tsc --noEmit
pnpm test                 # testes unitários com Vitest (src/**/*.{test,spec}.{ts,tsx})
pnpm build && pnpm test:e2e   # Playwright; serve o diretório out/ já gerado, então faça o build antes
```

Teste isolado: `pnpm exec vitest run src/tests/Button.test.tsx` (ou `-t "<nome>"`);
`pnpm exec playwright test e2e/home.spec.ts -g "<nome>"`.

O CI (`.github/workflows/deploy.yml`, em push para `main`) roda lint → typecheck → test → build e
depois publica `out/` no Pages. Os testes E2E **não** rodam no CI.

## Arquitetura

- **Somente export estático.** `next.config.ts` define `output: 'export'`, `images.unoptimized` e
  um `basePath` de `/${repoName}` só em produção, para o GitHub Pages. Nada que dependa de
  servidor funciona (route handlers, SSR, middleware, server actions, otimização do `next/image`).
  Rotas como `src/app/sitemap.ts` precisam de `export const dynamic = 'force-static'`.
  Atenção: o Playwright serve `out/` na raiz (`serve out -p 3000`), enquanto builds de produção
  prefixam os assets com `/nextforge`; considere o basePath ao depurar falhas de E2E.
- **Conteúdo separado dos componentes.** Os textos ficam em `src/content/home.ts` como objetos
  `as const`; os componentes de seção em `src/components/sections/` os importam e usam como valor
  padrão das props (ex.: `Hero` aceita sobrescritas, mas cai em `heroContent`). `src/app/page.tsx`
  apenas compõe as seções. Primitivos reutilizáveis ficam em `src/components/ui/`.
- **Lógica de domínio fica em `src/lib/`**, não nos componentes. `src/lib/contact-form.ts` contém
  o schema zod (importado de `zod/v4`), valores padrão, labels, validação do endpoint do Formspree
  e o mapeamento das mensagens de erro do Formspree; `Contact.tsx` (o único client component) liga
  tudo isso ao react-hook-form. Os testes unitários testam essas funções de `lib` diretamente.
- **Hooks e tipos compartilhados** vão em `src/hooks/` e `src/types/` (hoje vazios, mantidos com
  `.gitkeep` conforme a estrutura do `PLANO-BOILERPLATE.md`).
- **Formulário de contato** envia pelo cliente para `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (veja
  `.env.example`; no CI vem da variável de repositório de mesmo nome). Sem ela, o formulário roda
  em "modo demo" com o envio desabilitado.
- **Estilos:** apenas SCSS + CSS Modules — sem Tailwind ou classes utilitárias. Cada componente tem
  um `*.module.scss` irmão que faz `@use '../../styles/abstracts/variables' as *;` (e `mixins`)
  para os tokens de design (`$spacing-*`, `$color-*`, `$font-size-*`) e mixins (`container`,
  `flex`, `focus-ring`). Os estilos globais entram por `src/styles/globals.scss`, importado em
  `layout.tsx`. Nomes de classe em camelCase.
- **Alias de caminho:** `@/*` → `src/*` (configurado em `tsconfig.json` e `vitest.config.ts`).
- O Vitest roda em jsdom com globals e `@testing-library/jest-dom` (`src/tests/setup.ts`); os CSS
  Modules usam nomes de classe `non-scoped` nos testes, então `styles.foo` resolve para `foo`.

## Convenções

- A formatação é aplicada pelo ESLint `@stylistic` (sem Prettier): indentação de 2 espaços, aspas
  simples (inclusive em atributos JSX), ponto e vírgula, vírgula final em multilinha, máximo de 100
  caracteres e quebra de linha no fim do arquivo. Em quebras de linha, operadores ficam no início
  da linha seguinte (exceto `=`), então strings longas são divididas com `+` no começo da linha.
- O ESLint também aplica as regras `recommended` e `core-web-vitals` do `@next/eslint-plugin-next`.
- Commits seguem Conventional Commits (commitlint via `commit-msg` do Husky); o `pre-commit` roda
  o lint-staged (`eslint --fix` / `stylelint --fix`).
- Pontos de customização por projeto: `src/content/home.ts`, metadata em `src/app/layout.tsx`,
  `repoName` em `next.config.ts` e tokens em `src/styles/abstracts/_variables.scss`.
- `PLANO-BOILERPLATE.md` é a especificação/plano original do boilerplate (alguns itens, como o
  lucide-react, estão planejados mas não instalados).
