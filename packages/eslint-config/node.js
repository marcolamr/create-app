import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import globals from "globals";
import { sharedRulesConfig } from "./shared-rules.js";

/**
 * ESLint configuration for Node.js / CLI packages.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nodeConfig = defineConfig([
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  globalIgnores(["dist/**", "node_modules/**"]),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  sharedRulesConfig,
]);
