import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { Project } from '../core/project.js';
import { scaffoldBase } from '../core/scaffold.js';
import { defaultStack, minimalStack, withTempDir } from '../test/helpers.js';
import { applyFeatures } from './index.js';

async function scaffoldWithFeatures(
  dir: string,
  name: string,
  stack: ReturnType<typeof defaultStack>,
): Promise<Project> {
  await scaffoldBase(dir);
  const project = new Project(dir, name, name, stack);
  applyFeatures(project);
  return project;
}

describe('applyFeatures', () => {
  it('scaffolds minimal stack', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'minimal', minimalStack());

      expect(fs.existsSync(path.join(dir, 'src/app/page.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'drizzle.config.ts'))).toBe(false);
      expect(fs.existsSync(path.join(dir, '.env'))).toBe(true);
    });
  });

  it('scaffolds full default stack', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'full-app', defaultStack());

      const authDir = path.join(dir, 'src/server/auth');
      expect(fs.existsSync(path.join(authDir, 'config.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'default-user-features.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'client.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'server.ts'))).toBe(true);
      expect(fs.existsSync(path.join(authDir, 'plugins/sync-bearer-token.ts'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(dir, 'src/app/api/auth/[...all]/route.ts'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(dir, 'src/server/better-auth'))).toBe(false);
      expect(fs.readFileSync(path.join(authDir, 'config.ts'), 'utf8')).toContain(
        './default-user-features',
      );
      expect(fs.existsSync(path.join(dir, 'drizzle.config.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'start-database.sh'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/styles/globals.css'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'eslint.config.mjs'))).toBe(true);
      expect(fs.existsSync(path.join(dir, '.env'))).toBe(true);
      expect(fs.existsSync(path.join(dir, '.env.example'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/env.js'))).toBe(true);
    });
  });

  it('does not scaffold auth without a database', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'no-db-auth', {
        ...minimalStack(),
        auth: true,
      });

      expect(fs.existsSync(path.join(dir, 'src/server/auth'))).toBe(false);
      expect(fs.existsSync(path.join(dir, 'src/app/api/auth'))).toBe(false);
    });
  });

  it('scaffolds auth schema without events when authEvents is false', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'auth-only', defaultStack());

      expect(fs.existsSync(path.join(dir, 'src/server/db/schema/events.ts'))).toBe(false);
      expect(
        fs.readFileSync(path.join(dir, 'src/server/db/schema/index.ts'), 'utf8'),
      ).not.toContain('./events');
      expect(fs.existsSync(path.join(dir, 'drizzle/sql'))).toBe(false);
      expect(fs.existsSync(path.join(dir, 'src/repositories'))).toBe(false);
    });
  });

  it('scaffolds neon drizzle without local database script', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'neon-app', {
        ...minimalStack(),
        drizzle: 'neon',
        auth: true,
      });

      expect(fs.existsSync(path.join(dir, 'start-database.sh'))).toBe(false);
      expect(fs.readFileSync(path.join(dir, '.env.example'), 'utf8')).toContain(
        'neon.tech',
      );
    });
  });

  it('scaffolds auth events (firewall, repositories, SQL)', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'events-app', {
        ...defaultStack(),
        authEvents: true,
      });

      expect(
        fs.existsSync(path.join(dir, 'src/server/auth/default-user-features.ts')),
      ).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/server/db/schema/events.ts'))).toBe(true);
      expect(
        fs.readFileSync(path.join(dir, 'src/server/db/schema/index.ts'), 'utf8'),
      ).toContain('./events');
      expect(fs.existsSync(path.join(dir, 'drizzle/sql/firewall_create_user.sql'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(dir, 'scripts/apply-sql.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/repositories/index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/server/db/firewall/create-user.ts'))).toBe(
        true,
      );

      const pkg = fs.readJsonSync(path.join(dir, 'package.json')) as {
        scripts: Record<string, string>;
      };
      expect(pkg.scripts['db:sql']).toBe('tsx scripts/apply-sql.ts');
      expect(pkg.scripts['db:sql:firewall']).toBe(
        'tsx scripts/apply-sql.ts firewall_create_user.sql',
      );
    });
  });

  it('uses css modules when tailwind is disabled', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'css-app', {
        ...minimalStack(),
        drizzle: 'postgres',
        auth: true,
      });

      expect(fs.existsSync(path.join(dir, 'src/app/index.module.css'))).toBe(true);
      expect(
        fs.readFileSync(path.join(dir, 'src/styles/globals.css'), 'utf8'),
      ).not.toContain('@import "tailwindcss"');
    });
  });
});
