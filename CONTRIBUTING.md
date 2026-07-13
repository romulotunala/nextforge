# Contribuindo

## Configuração do ambiente

```bash
git clone <url-do-repo>
cd nextforge
pnpm install
pnpm dev
```

## Fluxo de trabalho

1. Crie uma branch a partir de `main`: `git checkout -b feat/minha-feature`
2. Faça as alterações
3. Rode `pnpm lint` e `pnpm test` antes de commitar
4. Commit seguindo [Conventional Commits](https://conventionalcommits.org):
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `docs:` documentação
   - `style:` formatação (sem mudança de lógica)
   - `refactor:` refatoração
   - `test:` testes
   - `chore:` configuração, dependências
5. Abra um Pull Request para `main`

## Padrões de código

- Indentação: 2 espaços
- Aspas simples
- Ponto e vírgula obrigatório
- Vírgula final em objetos/arrays multiline
- Máximo 100 caracteres por linha
- Estilos: SCSS + CSS Modules (sem Tailwind)

## Testes

```bash
pnpm test         # unitários
pnpm build && pnpm test:e2e  # e2e (precisa do build)
```
