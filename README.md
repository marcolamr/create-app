# @madda/app

> O jeito mais rápido de começar um app full stack com a **madda stack** — typesafe, moderno e pronto pra produção.

[![npm version](https://img.shields.io/npm/v/@madda/app?label=%40madda%2Fapp)](https://www.npmjs.com/package/@madda/app)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#licença)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

```bash
pnpm create @madda/app
# ou
npx @madda/app@latest
# ou
npm create @madda/app@latest
```

---

## O que é?

**@madda/app** é o CLI oficial da org [**madda**](https://www.npmjs.com/org/madda) para gerar projetos [Next.js](https://nextjs.org/) com a **madda stack** — uma combinação opinativa de ferramentas para apps web full stack com foco em DX, type-safety e convenções que escalam.

Inspirado no fluxo do [create-t3-app](https://github.com/t3-oss/create-t3-app), montado do zero para o ecossistema **madda**.

### O que vem no template

| Camada | Tecnologia |
|--------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Estilo *(opcional)* | [Tailwind CSS](https://tailwindcss.com/) |
| ORM *(opcional)* | [Drizzle](https://orm.drizzle.team/) |
| Auth *(opcional)* | [Better Auth](https://www.better-auth.com/) |
| Banco *(opcional)* | PostgreSQL |
| Env | [@t3-oss/env-nextjs](https://env.t3.gg/) + [Zod](https://zod.dev/) |
| Lint/format *(opcional)* | ESLint + Prettier |

---

## Getting started

### Pré-requisitos

- **Node.js** 18+
- Um package manager: **pnpm** (recomendado), npm, yarn ou bun
- Conta npm com acesso à org **madda** *(apenas para quem for publicar o CLI)*

### Criar um projeto

```bash
pnpm create @madda/app meu-app
cd meu-app
pnpm dev
```

Sem prompts — usa os defaults:

```bash
pnpm create @madda/app meu-app -- --default
```

### Fluxo interativo

O CLI pergunta o que você quer incluir:

```
◆  What will your project be called?
◆  Will you be using TypeScript or JavaScript?
◆  Will you be using Tailwind CSS for styling?
◆  What authentication provider would you like to use?
◆  What database ORM would you like to use?
◆  Would you like to use ESLint and Prettier?
◆  Should we initialize a Git repository?
◆  Should we run 'pnpm install' for you?
◆  What import alias would you like to use?  →  @/
```

No final, o CLI instala dependências, formata o código, inicializa git (se pedido) e mostra os próximos passos.

---

## CLI

### Uso

```bash
madda-app [dir] [options]
```

> Ao instalar via `npx @madda/app`, o binário disponível é `madda-app`.

### Opções

| Flag | Descrição |
|------|-----------|
| `[dir]` | Nome/pasta do projeto |
| `-y, --default` | Pula prompts e usa defaults |
| `--noGit` | Não inicializa repositório git |
| `--noInstall` | Não roda install do package manager |
| `--dbProvider [provider]` | Provider do banco (`postgres`) |
| `-v, --version` | Versão do CLI |
| `-h, --help` | Ajuda |

### Exemplos

```bash
# Projeto na pasta atual
pnpm create @madda/app .

# Sem git e sem install (útil em CI)
pnpm create @madda/app meu-app -- --noGit --noInstall
```

---

## Estrutura gerada

```
meu-app/
├── src/
│   ├── app/           # App Router (Next.js)
│   ├── env.js         # Variáveis de ambiente validadas
│   └── styles/        # CSS global
├── public/
├── next.config.ts
├── tsconfig.json
└── package.json
```

Com **Drizzle**, **Better Auth**, **Tailwind** e **ESLint**, arquivos extras são adicionados automaticamente.

---

## Desenvolvimento deste repositório

Monorepo gerenciado com [Turborepo](https://turbo.build/) + [pnpm workspaces](https://pnpm.io/workspaces).

```
create-md-app/              # repo local (nome da pasta pode variar)
├── apps/cli/               # @madda/app (publicável)
├── packages/
│   ├── eslint-config/      # @repo/eslint-config
│   ├── prettier-config/    # @repo/prettier-config
│   └── typescript-config/  # @repo/typescript-config
└── _apps/                  # referência local (ignorado pelo git)
```

### Setup

```bash
git clone <seu-repo>
cd create-md-app
pnpm install
```

### Scripts principais

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Dev do CLI com hot reload |
| `pnpm build:cli` | Build do `@madda/app` |
| `pnpm --filter @madda/app start` | Roda o CLI buildado |
| `pnpm lint` | ESLint no monorepo |
| `pnpm check-types` | Typecheck |
| `pnpm format` | Prettier no monorepo |

### Rodar o CLI localmente

```bash
pnpm build:cli
pnpm --filter @madda/app start
# ou em dev
pnpm --filter @madda/app dev
```

Testar em outra pasta:

```bash
node apps/cli/dist/index.js meu-teste
```

### Releases (org madda no npm)

```bash
# 1. Registrar mudança
pnpm changeset

# 2. Aplicar bump de versão + CHANGELOG
pnpm release

# 3. Publicar na org @madda
pnpm pub:release
# ou beta
pnpm pub:beta
```

Publicação requer login npm com permissão na org **madda** e `publishConfig.access: public` (já configurado).

---

## Stack técnica do CLI

- [@clack/prompts](https://github.com/bombshell-dev/clack) — prompts interativos
- [Commander](https://github.com/tj/commander.js) — parsing de args
- [tsup](https://tsup.egoist.dev/) — bundler
- [Changesets](https://github.com/changesets/changesets) — releases

---

## Contribuindo

1. Fork + branch
2. `pnpm install`
3. Faça suas alterações
4. `pnpm lint && pnpm check-types && pnpm build:cli`
5. `pnpm changeset` (se for release)
6. Abra um PR

---

## Licença

MIT — veja `apps/cli/package.json`.
