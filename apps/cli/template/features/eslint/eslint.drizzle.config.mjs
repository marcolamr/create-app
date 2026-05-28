import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import drizzle from 'eslint-plugin-drizzle';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    '.source/**',
  ]),

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      drizzle,
    },
    rules: {
      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // Side effect imports
            ['^react', '^next'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Remove unused imports
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      // Drizzle: avoid accidental DELETE/UPDATE without WHERE
      'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: ['db'] }],
      'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: ['db'] }],
    },
  },
]);

export default eslintConfig;
