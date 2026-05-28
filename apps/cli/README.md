# @madda/app

Scaffold a **Next.js** full-stack app with the **madda stack** — TypeScript, optional Tailwind, Drizzle, Better Auth, and more.

[![npm version](https://img.shields.io/npm/v/@madda/app?label=%40madda%2Fapp)](https://www.npmjs.com/package/@madda/app)

---

## English

### Quick start

**Requirements:** Node.js 18+ and npm, pnpm, yarn, or bun.

```bash
pnpm create @madda/app my-app
cd my-app
pnpm dev
```

Other package managers:

```bash
npx @madda/app@latest my-app
npm create @madda/app@latest my-app
```

Skip prompts (full default stack: Tailwind, ESLint, Better Auth, Drizzle):

```bash
pnpm create @madda/app my-app -- --default
```

Create in the current folder:

```bash
pnpm create @madda/app . -- --default
```

### What you get (default stack)

| Piece          | Tech                              |
| -------------- | --------------------------------- |
| Framework      | Next.js 16 (App Router)           |
| Language       | TypeScript                        |
| Styling        | Tailwind CSS v4                   |
| Database       | PostgreSQL + Drizzle ORM          |
| Auth           | Better Auth                       |
| Env validation | `@t3-oss/env-nextjs` + Zod        |
| Lint / format  | ESLint + Prettier                 |
| Server utils   | Logger (Pino), errors, IP helpers |

The CLI also generates `.env` / `.env.example`, a `start-database.sh` script, and `db:*` npm scripts.

### Interactive mode

If you run without `--default`, the CLI asks:

- Project name
- Tailwind CSS?
- ESLint + Prettier?
- Better Auth?
- Drizzle ORM (PostgreSQL)?
- Initialize git?
- Run install?

### CLI options

```bash
madda-app [dir] [options]
```

| Option                   | Description                              |
| ------------------------ | ---------------------------------------- |
| `[dir]`                  | Project folder name (default: `my-app`)  |
| `--default`              | Skip prompts; use the full default stack |
| `--no-git`               | Do not run `git init`                    |
| `--no-install`           | Do not install dependencies              |
| `--import-alias <alias>` | Import alias (default: `@/`)             |
| `-v, --version`          | Show CLI version                         |
| `-h, --help`             | Show help                                |

### After scaffolding (with Drizzle)

```bash
./start-database.sh   # local Postgres via Docker/Podman
pnpm db:push          # push schema to the database
pnpm dev
```

### Outdated CLI warning

If your local CLI version differs from the latest on npm, a yellow warning is printed before scaffolding. Update with:

```bash
npx @madda/app@latest
```

---

## Português

### Início rápido

**Requisitos:** Node.js 18+ e npm, pnpm, yarn ou bun.

```bash
pnpm create @madda/app meu-app
cd meu-app
pnpm dev
```

Outros gerenciadores:

```bash
npx @madda/app@latest meu-app
npm create @madda/app@latest meu-app
```

Sem prompts (stack padrão completa: Tailwind, ESLint, Better Auth, Drizzle):

```bash
pnpm create @madda/app meu-app -- --default
```

Na pasta atual:

```bash
pnpm create @madda/app . -- --default
```

### O que vem no projeto (stack padrão)

| Camada                | Tecnologia                 |
| --------------------- | -------------------------- |
| Framework             | Next.js 16 (App Router)    |
| Linguagem             | TypeScript                 |
| Estilo                | Tailwind CSS v4            |
| Banco                 | PostgreSQL + Drizzle ORM   |
| Auth                  | Better Auth                |
| Variáveis de ambiente | `@t3-oss/env-nextjs` + Zod |
| Lint / format         | ESLint + Prettier          |
| Utilitários server    | Logger (Pino), erros, IP   |

Também são gerados `.env`, `.env.example`, `start-database.sh` e scripts `db:*`.

### Modo interativo

Sem `--default`, o CLI pergunta:

- Nome do projeto
- Tailwind CSS?
- ESLint + Prettier?
- Better Auth?
- Drizzle ORM (PostgreSQL)?
- Inicializar git?
- Rodar install?

### Opções do CLI

```bash
madda-app [dir] [opções]
```

| Opção                    | Descrição                                 |
| ------------------------ | ----------------------------------------- |
| `[dir]`                  | Nome da pasta (padrão: `my-app`)          |
| `--default`              | Pula prompts; usa a stack padrão completa |
| `--no-git`               | Não executa `git init`                    |
| `--no-install`           | Não instala dependências                  |
| `--import-alias <alias>` | Alias de import (padrão: `@/`)            |
| `-v, --version`          | Versão do CLI                             |
| `-h, --help`             | Ajuda                                     |

### Depois de criar (com Drizzle)

```bash
./start-database.sh   # Postgres local (Docker/Podman)
pnpm db:push          # aplica o schema no banco
pnpm dev
```

### Aviso de versão desatualizada

Se a versão local do CLI for diferente da última no npm, um aviso amarelo aparece antes do scaffold. Atualize com:

```bash
npx @madda/app@latest
```

---

## License

MIT
