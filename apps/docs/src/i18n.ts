export type Lang = 'en' | 'pt-br';

export type FeatureIconId =
  | 'nextjs'
  | 'typescript'
  | 'drizzle'
  | 'better-auth'
  | 'tailwind'
  | 't3-env';

export type Feature = {
  icon: FeatureIconId;
  name: string;
  desc: string;
  url: string;
};

export type CliPreviewLine =
  | { type: 'command'; text: string }
  | { type: 'intro'; text: string }
  | { type: 'prompt'; text: string; answer: string }
  | { type: 'success'; text: string }
  | { type: 'outro'; text: string };

export type LandingCopy = {
  heroTitle: string;
  heroHighlight: string;
  heroSuffix: string;
  heroSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  install: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  cliPreview: CliPreviewLine[];
  stackTitle: string;
  stackSub: string;
  modularTitle: string;
  modularBody: string;
  docsCard: string;
  docsDesc: string;
  faqCard: string;
  faqDesc: string;
  features: Feature[];
};

export const copy = {
  en: {
    heroTitle: 'A great way to start a',
    heroHighlight: 'full-stack',
    heroSuffix: 'with Next.js',
    heroSub:
      'Type-safe from day one. Choose only what you need: Drizzle, Better Auth, Tailwind, and ESLint - and get your app up and running quickly.',
    ctaPrimary: 'Read the docs',
    ctaSecondary: 'Create a project',
    install: 'pnpm create @madda/app',
    aboutTitle: 'Type-safe from the first commit',
    aboutParagraphs: [
      'This starter was created to facilitate the creation of modern Next.js applications with TypeScript, maintaining a solid foundation without sacrificing flexibility.',
      'The framework comes pre-prepared with tools and patterns that work well together, the result of practical experience building real-world applications over the years.',
      'The idea is not to import a closed stack, but to offer a lean, modular, and easy-to-evolve starting point. You choose only what makes sense for your project.',
    ],
    cliPreview: [
      { type: 'command', text: 'pnpm create @madda/app' },
      { type: 'intro', text: '◆  create madda app' },
      { type: 'prompt', text: 'Project name', answer: 'my-madda-app' },
      { type: 'prompt', text: 'Tailwind CSS?', answer: 'Yes' },
      { type: 'prompt', text: 'ESLint + Prettier?', answer: 'Yes' },
      {
        type: 'prompt',
        text: 'Database (Drizzle ORM)?',
        answer: 'PostgreSQL (local Docker)',
      },
      { type: 'prompt', text: 'Better Auth?', answer: 'Yes' },
      { type: 'prompt', text: 'Include events?', answer: 'No' },
      { type: 'prompt', text: 'Initialize git?', answer: 'Yes' },
      { type: 'prompt', text: 'Run install?', answer: 'Yes' },
      { type: 'outro', text: 'Scaffolding...' },
    ],
    stackTitle: 'Bring your own pieces',
    stackSub:
      'Everything you need to create modern full-stack applications with TypeScript. No excess, no unnecessary complexity. Choose only the tools that make sense for your project.',
    modularTitle: 'Modular by design',
    modularBody:
      'Unlike an all-in-one boilerplate, @madda/app is a CLI that composes features. No database? No auth prompts. Need events and firewall SQL? Opt in when it makes sense.',
    docsCard: 'Documentation',
    docsDesc: 'Install, CLI flags, stack guides, and environment variables.',
    faqCard: 'FAQ',
    faqDesc: 'Short answers about auth, Drizzle, monorepo dev, and releases.',
    features: [
      {
        icon: 'nextjs',
        name: 'Next.js',
        desc: 'Used by major companies worldwide, Next.js allows you to create modern web applications with the power of React.',
        url: 'https://nextjs.org/',
      },
      {
        icon: 'typescript',
        name: 'TypeScript',
        desc: 'A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
        url: 'https://www.typescriptlang.org/',
      },
      {
        icon: 'drizzle',
        name: 'Drizzle',
        desc: 'Lightweight, high-performance, and type-safe, it is understated, flexible, and designed for serverless computing.',
        url: 'https://orm.drizzle.team/docs/get-started',
      },
      {
        icon: 'better-auth',
        name: 'Better Auth',
        desc: 'Auth that lives inside your app. Composable, plugin-based, and built to scale.',
        url: 'https://www.better-auth.com/docs/introduction',
      },
      {
        icon: 'tailwind',
        name: 'Tailwind CSS',
        desc: 'Rapidly build modern websites without ever leaving your HTML.',
        url: 'https://tailwindcss.com/docs/installation/using-vite',
      },
      {
        icon: 't3-env',
        name: 'T3 Env',
        desc: 'Framework agnostic validation for type-safe environment variables.',
        url: 'https://env.t3.gg/docs/introduction',
      },
    ] satisfies Feature[],
  } satisfies LandingCopy,
  'pt-br': {
    heroTitle: 'Uma ótima forma de começar um app',
    heroHighlight: 'full stack',
    heroSuffix: 'com Next.js',
    heroSub: 'Type-safe desde o primeiro commit',
    ctaPrimary: 'Ver documentação',
    ctaSecondary: 'Criar um projeto',
    install: 'pnpm create @madda/app',
    aboutTitle: 'Type-safe desde o primeiro commit',
    aboutParagraphs: [
      'Este starter foi criado para facilitar a criação de aplicações Next.js modernas com TypeScript, mantendo uma base sólida sem abrir mão da flexibilidade.',
      'A estrutura já vem preparada com ferramentas e padrões que funcionam bem juntos, resultado de experiência prática construindo aplicações reais ao longo dos anos.',
      'A ideia não é impor uma stack fechada, mas oferecer um ponto de partida enxuto, modular e fácil de evoluir. Você escolhe apenas o que faz sentido para o seu projeto.',
    ],
    cliPreview: [
      { type: 'command', text: 'pnpm create @madda/app' },
      { type: 'intro', text: '◆  create madda app' },
      { type: 'prompt', text: 'Project name', answer: 'meu-app-madda' },
      { type: 'prompt', text: 'Tailwind CSS?', answer: 'Yes' },
      { type: 'prompt', text: 'ESLint + Prettier?', answer: 'Yes' },
      {
        type: 'prompt',
        text: 'Database (Drizzle ORM)?',
        answer: 'PostgreSQL (local Docker)',
      },
      { type: 'prompt', text: 'Better Auth?', answer: 'Yes' },
      { type: 'prompt', text: 'Include events?', answer: 'No' },
      { type: 'prompt', text: 'Initialize git?', answer: 'Yes' },
      { type: 'prompt', text: 'Run install?', answer: 'Yes' },
      { type: 'outro', text: 'Scaffolding...' },
    ],
    stackTitle: 'Só o que você precisa',
    stackSub:
      'Tudo que você precisa para criar aplicações full stack modernas com TypeScript. Sem excesso, sem complexidade desnecessária. Escolha apenas as ferramentas que fazem sentido para o seu projeto.',
    modularTitle: 'Modular de propósito',
    modularBody:
      'O @madda/app é um CLI que monta features. Sem banco? Sem prompt de auth. Quer eventos e SQL de firewall? Ative quando fizer sentido.',
    docsCard: 'Documentação',
    docsDesc: 'Instalação, flags do CLI, stack e variáveis de ambiente.',
    faqCard: 'FAQ',
    faqDesc: 'Respostas rápidas sobre auth, Drizzle, monorepo e releases.',
    features: [
      {
        icon: 'nextjs',
        name: 'Next.js',
        desc: 'Usado por grandes empresas do mundo todo, o Next.js permite criar aplicações web modernas com o poder do React.',
        url: 'https://nextjs.org/',
      },
      {
        icon: 'typescript',
        name: 'TypeScript',
        desc: 'Uma linguagem de programação fortemente tipada que se baseia no JavaScript, oferecendo melhores ferramentas em qualquer escala.',
        url: 'https://www.typescriptlang.org/',
      },
      {
        icon: 'drizzle',
        name: 'Drizzle',
        desc: 'Leve, performático, seguro em relação a tipos, é sóbrio, flexível e pronto para computação sem servidor por design.',
        url: 'https://orm.drizzle.team/docs/get-started',
      },
      {
        icon: 'better-auth',
        name: 'Better Auth',
        desc: 'Autenticação integrada ao seu aplicativo. Modular, baseada em plugins e feita para escalar.',
        url: 'https://www.better-auth.com/docs/introduction',
      },
      {
        icon: 'tailwind',
        name: 'Tailwind CSS',
        desc: 'Crie sites modernos rapidamente, sem nunca sair do seu código HTML.',
        url: 'https://tailwindcss.com/docs/installation/using-vite',
      },
      {
        icon: 't3-env',
        name: 'T3 Env',
        desc: 'Validação agnóstica de frameworks para variáveis ​​de ambiente com tipagem estática.',
        url: 'https://env.t3.gg/docs/introduction',
      },
    ] satisfies Feature[],
  } satisfies LandingCopy,
} as const satisfies Record<Lang, LandingCopy>;

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
  ],
};
