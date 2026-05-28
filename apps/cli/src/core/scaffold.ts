import fs from 'fs-extra';
import path from 'node:path';

import { TEMPLATE_ROOT } from './paths.js';

export async function scaffoldBase(projectDir: string): Promise<void> {
  const baseDir = path.join(TEMPLATE_ROOT, 'base');

  fs.mkdirSync(projectDir, { recursive: true });
  fs.copySync(baseDir, projectDir, { overwrite: true });

  const gitignore = path.join(projectDir, '_gitignore');
  if (fs.existsSync(gitignore)) {
    fs.renameSync(gitignore, path.join(projectDir, '.gitignore'));
  }
}
