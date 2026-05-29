import fs from 'fs-extra';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createProject } from './create-project.js';
import { defaultFlags, defaultStack, withTempDir } from './test/helpers.js';

vi.mock('execa', () => ({
  execa: vi.fn(async (cmd: string, args: string[]) => {
    if (args[0] === '-v') return { stdout: '9.0.0' };
    return { stdout: '', exitCode: 0 };
  }),
}));

vi.mock('./utils/git.js', () => ({
  finalizeGit: vi.fn(async () => undefined),
}));

describe('createProject', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scaffolds a project without install or git', async () => {
    await withTempDir(async (parent) => {
      const cwd = process.cwd();
      process.chdir(parent);

      try {
        const projectDir = await createProject({
          appName: 'generated-app',
          stack: defaultStack(),
          flags: defaultFlags(),
        });

        expect(projectDir).toBe(path.join(parent, 'generated-app'));
        expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);

        const pkg = fs.readJsonSync(path.join(projectDir, 'package.json')) as {
          name: string;
          MaddaMetadata?: { initVersion: string };
        };

        expect(pkg.name).toBe('generated-app');
        expect(pkg.MaddaMetadata?.initVersion).toMatch(/^\d+\.\d+\.\d+/);
        expect(fs.existsSync(path.join(projectDir, 'src/server/auth/config.ts'))).toBe(
          true,
        );
        expect(fs.existsSync(path.join(projectDir, 'src/server/better-auth'))).toBe(
          false,
        );
      } finally {
        process.chdir(cwd);
      }
    });
  });
});
