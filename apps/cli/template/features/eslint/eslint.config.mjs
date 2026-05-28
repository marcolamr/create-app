import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
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
  ]),

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
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
    },
  },
]);

export default eslintConfig;
