import { nodeConfig } from '@repo/eslint-config/node';
import { defineConfig, globalIgnores } from 'eslint/config';

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  // Scaffold templates ship their own eslint.config for generated apps.
  globalIgnores(['template/**']),
  ...nodeConfig,
]);
