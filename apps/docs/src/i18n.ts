export type Lang = 'en' | 'pt-br';

export const copy = {
  en: {
    heroTitle: 'The best way to start a',
    heroHighlight: 'full-stack',
    heroSuffix: 'Next.js app with the madda stack',
    heroSub:
      'Typesafe from day one. Pick only what you need — Drizzle, Better Auth, Tailwind, ESLint — and ship.',
    ctaPrimary: 'Read the docs',
    ctaSecondary: 'Create a project',
    install: 'pnpm create @madda/app',
    stackTitle: 'Bring your own pieces',
    stackSub: 'We encode opinions from real projects. You choose the modules — nothing more.',
    modularTitle: 'Modular by design',
    modularBody:
      'Unlike an all-in-one boilerplate, @madda/app is a CLI that composes features. No database? No auth prompts. Need events and firewall SQL? Opt in when it makes sense.',
    docsCard: 'Documentation',
    docsDesc: 'Install, CLI flags, stack guides, and environment variables.',
    faqCard: 'FAQ',
    faqDesc: 'Short answers about auth, Drizzle, monorepo dev, and releases.',
    features: [
      {
        name: 'Next.js',
        desc: 'App Router, React Compiler, and conventions that scale.',
      },
      {
        name: 'TypeScript',
        desc: 'Strict types across the CLI, templates, and generated apps.',
      },
      {
        name: 'Drizzle',
        desc: 'Postgres local or Neon serverless — schema and migrations your way.',
      },
      {
        name: 'Better Auth',
        desc: 'Email/password, OAuth, 2FA — wired when you pick a database.',
      },
      {
        name: 'Tailwind CSS',
        desc: 'Optional styling with v4 and sensible defaults.',
      },
      {
        name: 't3-env',
        desc: 'Validated environment variables with Zod — fewer prod surprises.',
      },
    ],
  },
  'pt-br': {
    heroTitle: 'O jeito mais rápido de começar um app',
    heroHighlight: 'full stack',
    heroSuffix: 'Next.js com a madda stack',
    heroSub:
      'Typesafe desde o dia um. Escolha só o que precisa — Drizzle, Better Auth, Tailwind, ESLint — e coloque no ar.',
    ctaPrimary: 'Ver documentação',
    ctaSecondary: 'Criar um projeto',
    install: 'pnpm create @madda/app',
    stackTitle: 'Só o que você precisa',
    stackSub:
      'Opiniões de projetos reais, sem te prender em um template gigante. Você escolhe os módulos.',
    modularTitle: 'Modular de propósito',
    modularBody:
      'O @madda/app é um CLI que monta features. Sem banco? Sem prompt de auth. Quer eventos e SQL de firewall? Ative quando fizer sentido.',
    docsCard: 'Documentação',
    docsDesc: 'Instalação, flags do CLI, stack e variáveis de ambiente.',
    faqCard: 'FAQ',
    faqDesc: 'Respostas rápidas sobre auth, Drizzle, monorepo e releases.',
    features: [
      {
        name: 'Next.js',
        desc: 'App Router, React Compiler e convenções que escalam.',
      },
      {
        name: 'TypeScript',
        desc: 'Tipos estritos no CLI, nos templates e no app gerado.',
      },
      {
        name: 'Drizzle',
        desc: 'Postgres local ou Neon serverless — schema e migrations do seu jeito.',
      },
      {
        name: 'Better Auth',
        desc: 'Email/senha, OAuth, 2FA — quando você escolhe um banco.',
      },
      {
        name: 'Tailwind CSS',
        desc: 'Estilo opcional com v4 e defaults sensatos.',
      },
      {
        name: 't3-env',
        desc: 'Variáveis de ambiente validadas com Zod — menos surpresa em produção.',
      },
    ],
  },
} as const;

export type FaqItem = { q: string; a: string };

export const faq: Record<Lang, FaqItem[]> = {
  en: [
    {
      q: 'Is this a framework?',
      a: 'No. @madda/app is a CLI that scaffolds a Next.js project. You own the code and add libraries as you grow.',
    },
    {
      q: 'Can I use Better Auth without a database?',
      a: 'Not in the current CLI flow. Better Auth is offered only after you pick Drizzle (Postgres or Neon), because the template uses the Drizzle adapter.',
    },
    {
      q: 'What are “events” and the firewall?',
      a: 'Optional module: an events table, repositories, SQL function `firewall_create_user`, and scripts to apply raw SQL. It rate-limits sign-ups per IP.',
    },
    {
      q: 'pnpm, npm, or bun?',
      a: 'The CLI detects your package manager from npm_config_user_agent. pnpm is recommended and used in docs examples.',
    },
    {
      q: 'How do I run the CLI locally from this monorepo?',
      a: 'pnpm install, pnpm build:cli, then pnpm --filter @madda/app start. See Contributing in the docs.',
    },
    {
      q: 'Does search work offline?',
      a: 'Docs search uses Pagefind (bundled at build time). It works on the published static site — no paid search API.',
    },
  ],
  'pt-br': [
    {
      q: 'Isso é um framework?',
      a: 'Não. O @madda/app é um CLI que gera um projeto Next.js. O código é seu; você evolui o app como quiser.',
    },
    {
      q: 'Posso usar Better Auth sem banco?',
      a: 'Não no fluxo atual do CLI. O Better Auth só aparece depois de escolher Drizzle (Postgres ou Neon), porque o template usa o adapter Drizzle.',
    },
    {
      q: 'O que são “eventos” e o firewall?',
      a: 'Módulo opcional: tabela de eventos, repositories, função SQL `firewall_create_user` e scripts para aplicar SQL. Limita cadastros por IP.',
    },
    {
      q: 'pnpm, npm ou bun?',
      a: 'O CLI detecta o package manager pelo npm_config_user_agent. Recomendamos pnpm nos exemplos da documentação.',
    },
    {
      q: 'Como rodar o CLI localmente neste monorepo?',
      a: 'pnpm install, pnpm build:cli, depois pnpm --filter @madda/app start. Veja Contribuindo na documentação.',
    },
    {
      q: 'A busca funciona sem API paga?',
      a: 'Sim. A busca usa Pagefind (indexada no build). Funciona no site estático publicado — sem API paga.',
    },
  ],
};
