import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Walk up until we find template/base (works from dist/ or src/ during tests). */
function findPkgRoot(fromDir: string): string {
  let dir = fromDir;
  for (;;) {
    if (fs.existsSync(path.join(dir, 'template', 'base'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('CLI package root not found (missing template/base)');
    }
    dir = parent;
  }
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export const PKG_ROOT = findPkgRoot(moduleDir);
export const TEMPLATE_ROOT = path.join(PKG_ROOT, 'template');
