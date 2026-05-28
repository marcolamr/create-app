import fs from 'fs-extra';
import path from 'node:path';

import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';
import { getUserPkgManager } from '../utils/pkg-manager.js';

export const eslintFeature: Feature = {
  id: 'eslint',
  when: (stack) => stack.eslint,
  apply(project) {
    project.addDevDeps(
      'prettier',
      'eslint',
      'eslint-config-next',
      'eslint-plugin-simple-import-sort',
      'eslint-plugin-unused-imports',
    );

    if (project.has('tailwind')) {
      project.addDevDeps('prettier-plugin-tailwindcss');
    }
    if (project.usesDrizzle()) {
      project.addDevDeps('eslint-plugin-drizzle');
    }

    project.addScripts({
      lint: 'next lint',
      'lint:fix': 'next lint --fix',
      check: 'next lint && tsc --noEmit',
      'format:write': 'prettier --write "**/*.{ts,tsx,js,jsx,mdx}" --cache',
      'format:check': 'prettier --check "**/*.{ts,tsx,js,jsx,mdx}" --cache',
    });

    const { eslint: E } = TEMPLATE;
    const prettierSrc = project.has('tailwind') ? E.prettierTailwind : E.prettier;
    project.copyRaw(prettierSrc, '.prettierrc');
    project.copyRaw(E.prettierIgnore, '.prettierignore');

    const eslintSrc = project.usesDrizzle() ? E.drizzle : E.base;
    project.copyRaw(eslintSrc, 'eslint.config.mjs');

    if (getUserPkgManager() === 'pnpm') {
      fs.copyFileSync(project.tpl(E.pnpmRc), path.join(project.dir, '.npmrc'));
    }
  },
};
