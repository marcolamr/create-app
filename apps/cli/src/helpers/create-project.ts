import fs from 'node:fs';
import path from 'node:path';

import { PKG_ROOT } from '@/constants';
import { DatabaseProvider, PkgInstallerMap } from '@/installers/types';
import { getUserPkgManager } from '@/utils/getter';

import { selectAppFile, selectIndexFile } from './boilerplate';
import { installPackages } from './install-packages';
import { scaffoldProject } from './scaffold-project';

interface CreateProjectOptions {
  projectName: string;
  packages: PkgInstallerMap;
  scopedAppName: string;
  noInstall: boolean;
  importAlias: string;
  databaseProvider: DatabaseProvider;
}

export const createProject = async ({
  projectName,
  scopedAppName,
  packages,
  noInstall,
  databaseProvider,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  // Bootstraps the base Next.js application
  await scaffoldProject({
    projectName,
    projectDir,
    pkgManager,
    scopedAppName,
    noInstall,
    databaseProvider,
  });

  // Install the selected packages
  installPackages({
    projectName,
    scopedAppName,
    projectDir,
    pkgManager,
    packages,
    noInstall,
    databaseProvider,
  });

  selectAppFile({ projectDir, packages });
  selectIndexFile({ projectDir, packages });

  // If no tailwind, select use css modules
  if (!packages.tailwind.inUse) {
    const indexModuleCss = path.join(PKG_ROOT, 'template/extras/src/index.module.css');
    const indexModuleCssDest = path.join(projectDir, 'src', 'app', 'index.module.css');
    fs.copyFileSync(indexModuleCss, indexModuleCssDest);
  }

  return projectDir;
};
