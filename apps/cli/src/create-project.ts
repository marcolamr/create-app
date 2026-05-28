import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import type { PackageJson } from 'type-fest';

import { Project } from './core/project.js';
import { scaffoldBase } from './core/scaffold.js';
import type { CreateInput } from './core/types.js';
import { applyFeatures } from './features/index.js';
import { finalizeGit } from './utils/git.js';
import { printNextSteps } from './utils/next-steps.js';
import { parseNameAndPath } from './utils/paths.js';
import { getUserPkgManager, getVersion } from './utils/pkg-manager.js';

type MaddaPackageJSON = PackageJson & {
  MaddaMetadata?: { initVersion: string };
};

export async function createProject(input: CreateInput): Promise<string> {
  const [scopedName, dirName] = parseNameAndPath(input.appName);
  const projectDir = path.resolve(process.cwd(), dirName);

  await scaffoldBase(projectDir);

  const project = new Project(projectDir, dirName, scopedName, input.stack);
  applyFeatures(project);

  const pkgManager = getUserPkgManager();
  const pkgPath = path.join(projectDir, 'package.json');
  const pkg = fs.readJsonSync(pkgPath) as MaddaPackageJSON;

  pkg.name = scopedName;
  pkg.MaddaMetadata = { initVersion: getVersion() };

  if (pkgManager !== 'bun') {
    const { stdout } = await execa(pkgManager, ['-v'], { cwd: projectDir });
    pkg.packageManager = `${pkgManager}@${stdout.trim()}`;
  }

  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

  if (!input.flags.noInstall) {
    await execa(pkgManager, ['install'], { cwd: projectDir, stdio: 'inherit' });

    if (input.stack.eslint) {
      await execa(pkgManager, ['run', 'format:write'], {
        cwd: projectDir,
        stdio: 'inherit',
      }).catch(() => undefined);
    }
  }

  if (!input.flags.noGit) {
    await finalizeGit(projectDir);
  }

  printNextSteps({
    projectName: dirName,
    projectDir,
    stack: input.stack,
    noInstall: input.flags.noInstall,
  });

  return projectDir;
}
