import fs from 'fs-extra';
import path from 'node:path';

import { PKG_ROOT } from '@/constants';
import { addPackageDependency } from '@/utils/adder';
import { addPackageScript } from '@/utils/adder';
import { getUserPkgManager } from '@/utils/getter';

import type { Installer } from '../types';
import type { AvailableDependencies } from './dependency-map';

// Also installs prettier
export const dynamicEslintInstaller: Installer = ({ projectDir, packages }) => {
  const devPackages: AvailableDependencies[] = [
    'prettier',
    'eslint',
    'eslint-config-next',
    'typescript-eslint',
    '@eslint/eslintrc',
  ];

  if (packages?.tailwind.inUse) {
    devPackages.push('prettier-plugin-tailwindcss');
  }
  if (packages?.drizzle.inUse) {
    devPackages.push('eslint-plugin-drizzle');
  }

  addPackageDependency({
    projectDir,
    dependencies: devPackages,
    devMode: true,
  });
  const extrasDir = path.join(PKG_ROOT, 'template/extras');

  // Prettier
  let prettierSrc: string;
  if (packages?.tailwind.inUse) {
    prettierSrc = path.join(extrasDir, 'config/.tailwind.prettierrc');
  } else {
    prettierSrc = path.join(extrasDir, 'config/.prettierrc');
  }

  const prettierDest = path.join(projectDir, '.prettierrc');
  fs.copySync(prettierSrc, prettierDest);

  // Prettier ignore
  fs.copyFileSync(
    path.join(extrasDir, 'config/.prettierignore'),
    path.join(projectDir, '.prettierignore'),
  );

  // pnpm
  const pkgManager = getUserPkgManager();
  if (pkgManager === 'pnpm') {
    const pnpmSrc = path.join(extrasDir, 'pnpm/_npmrc');
    fs.copySync(pnpmSrc, path.join(projectDir, '.npmrc'));
  }

  addPackageScript({
    projectDir,
    scripts: {
      lint: 'next lint',
      'lint:fix': 'next lint --fix',
      check: 'next lint && tsc --noEmit',
      'format:write': 'prettier --write "**/*.{ts,tsx,js,jsx,mdx}" --cache',
      'format:check': 'prettier --check "**/*.{ts,tsx,js,jsx,mdx}" --cache',
    },
  });

  // eslint
  const usingDrizzle = !!packages?.drizzle?.inUse;
  const eslintConfigSrc = path.join(
    extrasDir,
    usingDrizzle ? 'config/_eslint.drizzle.mjs' : 'config/_eslint.base.mjs',
  );
  const eslintConfigDest = path.join(projectDir, 'eslint.config.mjs');

  fs.copySync(eslintConfigSrc, eslintConfigDest);
};
