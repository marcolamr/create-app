/** Pinned dependency versions for generated projects. */
export const DEP_VERSIONS = {
  'better-auth': '^1.6',
  'drizzle-kit': '^0.31.10',
  'drizzle-orm': '^0.45.2',
  postgres: '^3.4.9',
  '@neondatabase/serverless': '^1.0.2',
  '@paralleldrive/cuid2': '^2.2.2',
  pino: '^9.7.0',
  'pino-abstract-transport': '^2.0.0',
  '@axiomhq/js': '^1.3.1',
  '@vercel/functions': '^2.2.0',
  'is-in-subnet': '^4.0.1',
  tailwindcss: '^4.3.0',
  postcss: '^8.5.15',
  '@tailwindcss/postcss': '^4.3.0',
  prettier: '^3.8.3',
  'prettier-plugin-tailwindcss': '^0.8.0',
  eslint: '^9',
  'eslint-config-next': '^16.2.6',
  'eslint-plugin-drizzle': '^0.2.3',
  'eslint-plugin-simple-import-sort': '^13.0.0',
  'eslint-plugin-unused-imports': '^4.4.1',
  'babel-plugin-react-compiler': '1.0.0',
} as const;

export type DepName = keyof typeof DEP_VERSIONS;
