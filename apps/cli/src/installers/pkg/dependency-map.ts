/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // Better-Auth
  'better-auth': '^1.6',

  // Drizzle
  'drizzle-kit': '^0.31.10',
  'drizzle-orm': '^0.45.2',
  postgres: '^3.4.9',

  // TailwindCSS
  tailwindcss: '^4.3.0',
  postcss: '^8.5.15',
  '@tailwindcss/postcss': '^4.3.0',

  // eslint / prettier
  prettier: '^3.8.3',
  '@eslint/eslintrc': '^3.3.5',
  'prettier-plugin-tailwindcss': '^0.8.0',
  eslint: '^9',
  'eslint-config-next': '^16.2.6',
  'eslint-plugin-drizzle': '^0.2.3',
  'eslint-plugin-simple-import-sort': '^13.0.0',
  'eslint-plugin-unused-imports': '^4.4.1',
  'typescript-eslint': '^8.60.0',
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
