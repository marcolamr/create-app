import fs from 'fs-extra';
import path from 'node:path';
import { type PackageJson } from 'type-fest';

import { PKG_ROOT } from '@/constants';

export const getVersion = () => {
  const packageJsonPath = path.join(PKG_ROOT, 'package.json');
  const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;
  return packageJsonContent.version ?? '1.0.0';
};

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export const getUserPkgManager: () => PackageManager = () => {
  // This environment variable is set by npm and yarn but pnpm seems less consistent
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith('yarn')) {
      return 'yarn';
    } else if (userAgent.startsWith('pnpm')) {
      return 'pnpm';
    } else if (userAgent.startsWith('bun')) {
      return 'bun';
    } else {
      return 'npm';
    }
  } else {
    // If no user agent is set, assume npm
    return 'npm';
  }
};
