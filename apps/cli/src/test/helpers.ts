import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

export async function withTempDir(
  fn: (dir: string) => void | Promise<void>,
): Promise<void> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'madda-cli-'));
  try {
    await fn(dir);
  } finally {
    await fs.remove(dir);
  }
}

export function defaultStack() {
  return {
    auth: true,
    drizzle: 'postgres' as const,
    tailwind: true,
    eslint: true,
  };
}

export function minimalStack() {
  return {
    auth: false,
    drizzle: false as const,
    tailwind: false,
    eslint: false,
  };
}

export function defaultFlags() {
  return {
    noGit: true,
    noInstall: true,
    importAlias: '@/',
    defaults: true,
  };
}
