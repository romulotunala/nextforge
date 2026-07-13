# nextforge

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![SCSS Modules](https://img.shields.io/badge/SCSS-Modules-cc6699?logo=sass&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Boilerplate open source para **sites institucionais estáticos** com Next.js.

Pensado para devs que querem começar com uma base enxuta, moderna e fácil de adaptar,
sem precisar montar estrutura, lint, testes e deploy do zero em todo projeto novo.

## Por que usar

- Exportação estática pronta para GitHub Pages.
- Estrutura organizada para conteúdo, componentes e estilos.
- SCSS Modules em vez de classes utilitárias.
- TypeScript estrito desde o início.
- Lint, testes e hooks de qualidade já configurados.
- Base preparada para ser clonada, adaptada e publicada rápido.

## O que vem no boilerplate

| Área | Inclui |
|---|---|
| App | Next.js 16 + App Router + `output: 'export'` |
| UI | Seções institucionais base (`Hero`, `About`, `Services`, `Contact`) |
| Estilo | SCSS + CSS Modules + tokens e mixins globais |
| Qualidade | ESLint 9, Stylelint, Husky, lint-staged, commitlint |
| Testes | Vitest + Testing Library + Playwright |
| Formulário | react-hook-form + zod + integração opcional com Formspree |
| Deploy | GitHub Actions + GitHub Pages |

## Ideal para / Não ideal para

### Ideal para

- Sites institucionais e landing pages estáticas.
- Portfólios e páginas de empresa com poucas rotas.
- Projetos que fazem deploy no GitHub Pages ou em qualquer host estático.
- Quem quer SCSS Modules e TypeScript estrito já configurados.

### Não ideal para

- Aplicações que dependem de renderização no servidor (SSR) ou rotas de API.
- Conteúdo altamente dinâmico que exige backend próprio.
- Projetos que precisam de recursos que não funcionam com `output: 'export'`.

## Stack

| Item | Versão |
|---|---|
| Next.js | 16.x |
| React | 19 |
| TypeScript | 5 |
| Node.js | 24+ |
| Estilos | SCSS + CSS Modules |
| Testes | Vitest + Playwright |

## Começando

### Usando como template

1. Clique em **Use this template** no GitHub.
2. Crie um novo repositório a partir dele.
3. Clone o projeto gerado.
4. Instale as dependências.

```bash
pnpm install
pnpm dev
```

### Rodando localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # desenvolvimento
pnpm build        # build estático em out/
pnpm lint         # ESLint + Stylelint
pnpm lint:fix     # corrige problemas automáticos
pnpm test         # testes unitários
pnpm test:e2e     # testes end-to-end
```

## Pontos de customização

Os arquivos abaixo concentram quase tudo que costuma mudar de um projeto para outro:

- `src/content/home.ts`: textos principais da home
- `src/app/layout.tsx`: metadados globais da aplicação
- `next.config.ts`: `repoName` e comportamento de export estático
- `src/styles/abstracts/_variables.scss`: tokens visuais
- `src/components/sections/*`: estrutura e composição das seções

## Formulário de contato

O formulário funciona em **modo demo** por padrão. Para ativar envio real com Formspree:

1. Crie um formulário em https://formspree.io
2. Copie o endpoint fornecido no painel
3. Crie um arquivo `.env.local` com:

```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxabcd
```

Sem essa variável, o componente informa visualmente que o envio real não está ativo.

## Estrutura do projeto

```text
src/
├── app/               # App Router, layout e sitemap
├── components/
│   ├── sections/      # blocos de página
│   └── ui/            # componentes reutilizáveis
├── content/           # conteúdo estático editável
├── lib/               # lógica compartilhada por domínio
├── styles/            # SCSS global, tokens e base visual
└── tests/             # setup e testes unitários
```

## Deploy no GitHub Pages

1. Ajuste `repoName` em `next.config.ts` para o nome do seu repositório.
2. Faça push para `main`.
3. No GitHub, ative **Settings → Pages → Source: GitHub Actions**.

O workflow já está configurado para build e deploy do site estático.

## Extensões possíveis

Algumas evoluções naturais para projetos derivados desse template:

- i18n com `next-intl`
- CMS headless
- analytics privacy-friendly
- animações com `motion`
- Storybook para catálogo de componentes

## Contribuição

Contribuições são bem-vindas, especialmente melhorias que tornem o template mais reutilizável,
claro e fácil de manter.

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para o fluxo de contribuição.

## Licença

MIT
