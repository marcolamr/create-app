import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import type { PackageJson } from 'type-fest';

import { run } from './cli';
import { createProject } from './helpers/create-project';
import { formatProject } from './helpers/format';
import { initializeGit } from './helpers/git';
import { installDependencies } from './helpers/install-dependencies';
import { logNextSteps } from './helpers/log-next-step';
import { setImportAlias } from './helpers/set-import-alias';
import { buildPkgInstallerMap } from './installers';
import { getUserPkgManager, getVersion } from './utils/getter';
import { logger } from './utils/logger';
import { parseNameAndPath } from './utils/parser';
import { getNpmVersion, renderTitle, renderVersionWarning } from './utils/render';

type MaddaPackageJSON = PackageJson & {
  MaddaMetadata?: {
    initVersion: string;
  };
};

const main = async () => {
  const npmVersion = await getNpmVersion();
  const pkgManager = getUserPkgManager();

  renderTitle();

  if (npmVersion) {
    renderVersionWarning(npmVersion);
  }

  const {
    appName,
    packages,
    flags: { noGit, noInstall, importAlias },
    databaseProvider,
  } = await run();

  const usePackages = buildPkgInstallerMap(packages, databaseProvider);

  const [scopedAppName, appDir] = parseNameAndPath(appName);

  const projectDir = await createProject({
    projectName: appDir,
    scopedAppName,
    packages: usePackages,
    databaseProvider,
    importAlias,
    noInstall,
  });

  // Write name to package.json
  const pkgJson = fs.readJSONSync(
    path.join(projectDir, 'package.json'),
  ) as MaddaPackageJSON;
  pkgJson.name = scopedAppName;
  pkgJson.MaddaMetadata = { initVersion: getVersion() };

  // ? Bun doesn't support this field (yet)
  if (pkgManager !== 'bun') {
    const { stdout } = await execa(pkgManager, ['-v'], {
      cwd: projectDir,
    });
    pkgJson.packageManager = `${pkgManager}@${stdout.trim()}`;
  }

  fs.writeJSONSync(path.join(projectDir, 'package.json'), pkgJson, {
    spaces: 2,
  });

  // update import alias in any generated files if not using the default
  if (importAlias !== '@/') {
    setImportAlias(projectDir, importAlias);
  }

  if (!noInstall) {
    await installDependencies({ projectDir });

    await formatProject({
      pkgManager,
      projectDir,
      eslint: packages.includes('eslint'),
    });
  }

  if (!noGit) {
    await initializeGit(projectDir);
  }

  await logNextSteps({
    projectName: appDir,
    packages: usePackages,
    noInstall,
    projectDir,
    databaseProvider,
  });

  process.exit(0);
};

main().catch((err) => {
  logger.error('Aborting installation...');

  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      'An unknown error has occurred. Please open an issue on github with the below:',
    );

    console.log(err);
  }

  process.exit(1);
});
