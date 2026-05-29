import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { Project } from '../core/project.js';
import { scaffoldBase } from '../core/scaffold.js';
import { defaultStack, withTempDir } from '../test/helpers.js';
import { authFeature } from './auth.js';
import { serverFeature } from './server.js';

describe('authFeature', () => {
  it('requires drizzle and writes the full auth module under src/server/auth', async () => {
    await withTempDir(async (dir) => {
      await scaffoldBase(dir);
      const project = new Project(dir, 'app', 'app', defaultStack());
      serverFeature.apply(project);
      authFeature.apply(project);

      const authDir = path.join(dir, 'src/server/auth');
      expect(fs.existsSync(path.join(authDir, 'config.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'default-user-features.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'plugins/local-middleware.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'plugins/sync-bearer-token.ts'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(authDir, 'record-user-created-event.ts'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(dir, 'src/models/controller.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/models/authentication.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/lib/helpers/snakeize.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/lib/helpers/string.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/lib/helpers/is.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/server/db/firewall/create-user.ts'))).toBe(
        true,
      );

      const pkg = fs.readJsonSync(path.join(dir, 'package.json')) as {
        dependencies: Record<string, string>;
      };
      expect(pkg.dependencies.cookie).toBeDefined();
      expect(pkg.dependencies.joi).toBeDefined();
      expect(pkg.dependencies['remove-markdown']).toBeDefined();

      expect(
        fs.readFileSync(path.join(dir, 'src/app/api/v1/auth/[...all]/route.ts'), 'utf8'),
      ).toContain('@/server/auth');
      expect(fs.readFileSync(path.join(authDir, 'config.ts'), 'utf8')).toContain(
        'localMiddleware',
      );
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
