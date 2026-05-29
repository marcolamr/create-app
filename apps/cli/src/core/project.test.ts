import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { withTempDir } from '../test/helpers.js';
import { TEMPLATE_ROOT } from './paths.js';
import { Project } from './project.js';

describe('Project', () => {
  it('tracks enabled features', () => {
    const project = new Project('/tmp/demo', 'demo', 'demo', {
      auth: true,
      drizzle: 'postgres',
      tailwind: true,
      eslint: true,
    });

    expect(project.has('auth')).toBe(true);
    expect(project.has('tailwind')).toBe(true);
    expect(project.usesDrizzle()).toBe(true);
    expect(project.drizzleProvider).toBe('postgres');
  });

  it('throws when drizzle is disabled', () => {
    const project = new Project('/tmp/demo', 'demo', 'demo', {
      auth: false,
      drizzle: false,
      tailwind: false,
      eslint: false,
    });

    expect(() => project.drizzleProvider).toThrow('Drizzle is not enabled');
  });

  it('copies templates with replacements', async () => {
    await withTempDir(async (dir) => {
      await fs.copy(path.join(TEMPLATE_ROOT, 'base'), dir);

      const project = new Project(dir, 'my-app', 'my-app', {
        auth: false,
        drizzle: false,
        tailwind: false,
        eslint: false,
      });

      project.copy(
        'features/drizzle/server/db/schema/posts.ts',
        'src/server/db/schema/posts.ts',
      );

      const dest = path.join(dir, 'src/server/db/schema/posts.ts');
      expect(fs.existsSync(dest)).toBe(true);
      expect(fs.readFileSync(dest, 'utf8')).toContain('my-app');
      expect(fs.readFileSync(dest, 'utf8')).not.toContain('project1');
    });
  });

  it('merges dependencies and scripts', async () => {
    await withTempDir(async (dir) => {
      await fs.copy(path.join(TEMPLATE_ROOT, 'base'), dir);

      const project = new Project(dir, 'demo', 'demo', {
        auth: false,
        drizzle: 'postgres',
        tailwind: true,
        eslint: true,
      });

      project.addDeps('drizzle-orm');
      project.addDevDeps('drizzle-kit', 'tailwindcss');
      project.addScripts({ 'db:push': 'drizzle-kit push' });

      const pkg = fs.readJsonSync(path.join(dir, 'package.json')) as {
        dependencies: Record<string, string>;
        devDependencies: Record<string, string>;
        scripts: Record<string, string>;
      };

      expect(pkg.dependencies['drizzle-orm']).toBeDefined();
      expect(pkg.devDependencies['drizzle-kit']).toBeDefined();
      expect(pkg.devDependencies.tailwindcss).toBeDefined();
      expect(pkg.scripts['db:push']).toBe('drizzle-kit push');
    });
  });
});
