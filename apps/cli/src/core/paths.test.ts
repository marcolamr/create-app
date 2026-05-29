import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { PKG_ROOT, TEMPLATE_ROOT } from './paths.js';

describe('paths', () => {
  it('resolves package and template roots', () => {
    expect(fs.existsSync(PKG_ROOT)).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATE_ROOT, 'base'))).toBe(true);
    expect(fs.existsSync(path.join(PKG_ROOT, 'package.json'))).toBe(true);
  });
});
