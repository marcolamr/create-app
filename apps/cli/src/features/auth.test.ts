import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { Project } from '../core/project.js';
import { scaffoldBase } from '../core/scaffold.js';
import { defaultStack, withTempDir } from '../test/helpers.js';
import { authFeature } from './auth.js';

describe('authFeature', () => {
  it('requires drizzle and writes the full auth module under src/server/auth', async () => {
    await withTempDir(async (dir) => {
      await scaffoldBase(dir);
      const project = new Project(dir, 'app', 'app', defaultStack());
      authFeature.apply(project);

      const authDir = path.join(dir, 'src/server/auth');
      expect(fs.existsSync(path.join(authDir, 'config.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'default-user-features.ts'))).toBe(true);
      expect(
        fs.readFileSync(path.join(dir, 'src/app/api/auth/[...all]/route.ts'), 'utf8'),
      ).toContain('@/server/auth');
    });
  });

  it('does not run when drizzle is disabled', () => {
    const project = new Project('/tmp/x', 'x', 'x', {
      auth: true,
      authEvents: false,
      drizzle: false,
      tailwind: false,
      eslint: false,
    });

    expect(authFeature.when?.(project.stack)).toBe(false);
  });
});
