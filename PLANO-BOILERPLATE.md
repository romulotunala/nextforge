# Plano Definitivo — Boilerplate Next.js para Sites Institucionais

> Este documento é um **spec executável**. Pode ser colado inteiro como prompt inicial no
> Claude Code, ou usado como referência para pedir tarefas específicas ao GitHub Copilot
> (Chat/Agent mode) uma tarefa por vez. Cada fase é independente e verificável.

## 0. Objetivo

Criar um repositório-template no GitHub para bootstrap rápido de sites estáticos
institucionais/empresariais, com deploy automatizado no GitHub Pages.

## 1. Stack e versões-alvo

| Item | Versão/decisão | Motivo |
|---|---|---|
| Node.js | **24.x (LTS "Krypton")** | LTS ativo até abr/2028; recomendado para projetos novos |
| Gerenciador de pacotes | **pnpm** | instalação rápida, disco compartilhado, `node_modules` estrito |
| Next.js | **16.x**, `output: 'export'` | linha estável atual, Turbopack padrão, React Compiler estável |
| React | 19.2 (via Next 16) | — |
| TypeScript | `strict: true` desde o início | evita retrofit doloroso depois |
| Estilo | SCSS + CSS Modules | modular como Tailwind, sem classes utilitárias (requisito explícito) |
| Lint JS/TS | ESLint 9 (flat config) + `@stylistic/eslint-plugin` | formatação (tab, aspas, `;`, 100 col) como regra de lint, não Prettier |
| Lint CSS | Stylelint + `stylelint-config-standard-scss` | ESLint não cobre SCSS de verdade |
| Git hooks | Husky + lint-staged + commitlint (Conventional Commits) | qualidade não depende de disciplina manual |
| Testes unitários | Vitest + Testing Library | rápido, API compatível com Jest, zero config extra p/ TS |
| Testes e2e/smoke | Playwright | valida o HTML estático gerado (`out/`) |
| Formulários | react-hook-form + zod | padrão de fato para forms tipados e performáticos |
| Ícones | lucide-react | tree-shakeable, SVG puro |
| Animação (opcional) | Motion (ex-Framer Motion) | scroll reveals, transições de seção |
| Fontes | `next/font` | auto-hospedagem, sem requisição externa, melhora LCP/CLS |
| Analytics (opcional) | Umami ou Plausible | privacy-friendly, evita banner de cookies obrigatório |
| CI/CD | GitHub Actions + GitHub Pages (`actions/deploy-pages`) | grátis para sites 100% estáticos |

**Fora do escopo por padrão** (documentar como "como adicionar depois", não instalar):
Tailwind (explicitamente não desejado), CMS headless (Sanity/Contentful), i18n (`next-intl`),
Storybook, changesets — só entram se um projeto específico precisar.

## 2. Nome e metadados do repositório

- Nome do repositório: `nextforge`
- Marcar como **Template Repository** (Settings → Template repository) no GitHub
- Licença: MIT (ajustar se necessário)
- Branch padrão: `main`

## 3. Estrutura de pastas

```
nextforge/
├── .github/
│   ├── workflows/deploy.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── public/
│   ├── images/
│   └── .nojekyll
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (routes)/
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/
│   │   └── sections/
│   ├── styles/
│   │   ├── abstracts/       # _variables.scss, _mixins.scss, _functions.scss
│   │   ├── base/             # reset, typography
│   │   └── globals.scss
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── content/
├── .editorconfig
├── eslint.config.js
├── stylelint.config.js
├── commitlint.config.js
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 4. Arquivos de configuração (conteúdo de referência)

### `next.config.ts`
```ts
import type { NextConfig } from 'next';

const repoName = 'nextforge'; // ajustar por projeto

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  images: { unoptimized: true },
};

export default nextConfig;
```

### `eslint.config.js`
```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import next from '@next/eslint-plugin-next';

export default tseslint.config(
  { ignores: ['out/', '.next/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { '@stylistic': stylistic, '@next/next': next },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/max-len': ['error', { code: 100 }],
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
);
```

### `stylelint.config.js`
```js
export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'max-line-length': 100,
    'string-quotes': 'single',
  },
};
```

### `.editorconfig`
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
max_line_length = 100
```

### `.github/workflows/deploy.yml`
```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### `package.json` — trechos-chave
```json
{
  "engines": { "node": ">=24" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint . && stylelint \"src/**/*.scss\"",
    "lint:fix": "eslint . --fix && stylelint \"src/**/*.scss\" --fix",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "prepare": "husky"
  }
}
```

## 5. Fases de execução (ordem recomendada para o agente)

Peça uma fase de cada vez ao Copilot/Claude Code; não peça tudo de uma vez.

1. **Bootstrap** — `pnpm create next-app@latest` com TypeScript, App Router, sem Tailwind,
   sem ESLint padrão (vamos configurar o nosso). Ajustar para Node 24 e pnpm.
2. **Static export** — configurar `next.config.ts` conforme acima; adicionar `.nojekyll` em
   `public/`; validar `pnpm build` gera pasta `out/` corretamente.
3. **Lint e formatação** — instalar e configurar `eslint.config.js` (flat config + `@stylistic`),
   `stylelint.config.js`, `.editorconfig`; rodar `pnpm lint` e corrigir arquivos gerados pelo
   bootstrap que não sigam o padrão.
4. **Git hooks** — Husky + lint-staged (rodar lint apenas nos arquivos staged) + commitlint
   com preset Conventional Commits.
5. **Sistema de estilos** — criar `src/styles/abstracts` (`_variables.scss`, `_mixins.scss`),
   `src/styles/base` (reset + tipografia), `globals.scss` importando os parciais; criar um
   componente de exemplo (`Button`) com `Button.module.scss` demonstrando o padrão.
6. **Estrutura de conteúdo institucional** — criar seções de exemplo em
   `src/components/sections` (Hero, About, Services, Contact) usando App Router.
7. **Formulário de contato** — implementar com react-hook-form + zod, validação client-side,
   sem submissão real (deixar `TODO` para integração futura com endpoint/serviço de email).
8. **Testes** — configurar Vitest + Testing Library com 1-2 testes de exemplo (ex: Button,
   validação do formulário); configurar Playwright com 1 smoke test na home gerada em `out/`.
9. **CI/CD** — criar `.github/workflows/deploy.yml` conforme acima; habilitar GitHub Pages
   com source "GitHub Actions" nas configurações do repo.
10. **Documentação** — `README.md` explicando como usar o template (`Use this template`),
    scripts disponíveis, como customizar `basePath`/`repoName`, e um `CONTRIBUTING.md` curto.

## 6. Checklist de aceite

- [ ] `pnpm build` gera `out/` sem erros e sem uso de features incompatíveis com export estático
- [ ] `pnpm lint` passa sem warnings
- [ ] Indentação 2 espaços, aspas simples, `;` e vírgula final aplicados automaticamente
- [ ] Nenhuma dependência do Tailwind presente
- [ ] Workflow do GitHub Actions publica com sucesso em `https://<user>.github.io/<repo>/`
- [ ] README documenta como duplicar o template para um novo projeto

## 7. Nota sobre uso com GitHub Copilot (sem Claude Code configurado)

Como você vai usar o Copilot por enquanto, a forma mais eficiente é:

- Colar a **seção 5 (Fases)** uma de cada vez no Copilot Chat, pedindo "execute a fase N
  conforme o plano abaixo" e colando só a fase relevante + a seção 4 (arquivos de config).
- Copilot Agent mode (se disponível no seu plano) consegue rodar múltiplos arquivos de uma
  vez; nesse caso pode colar o documento inteiro e pedir para seguir a ordem das fases.
- Quando migrar para Claude Code, este mesmo arquivo pode virar a base de um `CLAUDE.md`
  ou `AGENTS.md` no repo, para o agente ler automaticamente o contexto do projeto.
