import fs from 'fs-extra';
import path from 'node:path';

import { PKG_ROOT } from '../core/paths.js';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function getUserPkgManager(): PackageManager {
  const agent = process.env.npm_config_user_agent ?? 'npm/';
  if (agent.startsWith('pnpm')) return 'pnpm';
  if (agent.startsWith('yarn')) return 'yarn';
  if (agent.startsWith('bun')) return 'bun';
  return 'npm';
}

export function getVersion(): string {
  const pkgPath = path.join(PKG_ROOT, 'package.json');
  return (fs.readJsonSync(pkgPath) as { version: string }).version;
}
