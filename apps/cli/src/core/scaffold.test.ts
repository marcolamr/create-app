import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { withTempDir } from '../test/helpers.js';
import { scaffoldBase } from './scaffold.js';

describe('scaffoldBase', () => {
  it('copies base template and renames gitignore', async () => {
    await withTempDir(async (dir) => {
      await scaffoldBase(dir);

      expect(fs.existsSync(path.join(dir, 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'src/app/layout.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(dir, '.gitignore'))).toBe(true);
      expect(fs.existsSync(path.join(dir, '_gitignore'))).toBe(false);
    });
  });
});
