import fs from 'fs-extra';
import path from 'node:path';

import { PKG_ROOT } from '@/constants';
import { type Installer } from '@/installers/types';
import { addPackageDependency } from '@/utils/adder';

export const tailwindInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: ['tailwindcss', 'postcss', '@tailwindcss/postcss'],
    devMode: true,
  });

  const extrasDir = path.join(PKG_ROOT, 'template/extras');

  const postcssCfgSrc = path.join(extrasDir, 'config/postcss.config.mjs');
  const postcssCfgDest = path.join(projectDir, 'postcss.config.mjs');

  const cssSrc = path.join(extrasDir, 'src/styles/globals.css');
  const cssDest = path.join(projectDir, 'src/styles/globals.css');

  fs.copySync(postcssCfgSrc, postcssCfgDest);
  fs.copySync(cssSrc, cssDest);
};
