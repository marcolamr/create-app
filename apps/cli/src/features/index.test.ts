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

      expect(fs.existsSync(path.join(dir, 'src/server/better-auth/config.ts'))).toBe(
        true,
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

  it('uses css modules when tailwind is disabled', async () => {
    await withTempDir(async (dir) => {
      await scaffoldWithFeatures(dir, 'css-app', {
        ...minimalStack(),
        auth: true,
      });

      expect(fs.existsSync(path.join(dir, 'src/app/index.module.css'))).toBe(true);
      expect(
        fs.readFileSync(path.join(dir, 'src/styles/globals.css'), 'utf8'),
      ).not.toContain('@import "tailwindcss"');
    });
  });
});
