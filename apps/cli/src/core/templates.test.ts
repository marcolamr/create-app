import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { TEMPLATE_ROOT } from './paths.js';
import { TEMPLATE } from './templates.js';

function collectTemplatePaths(value: unknown, acc: string[] = []): string[] {
  if (typeof value === 'string') {
    acc.push(value);
    return acc;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectTemplatePaths(item, acc);
    return acc;
  }

  if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectTemplatePaths(entry, acc);
  }

  return acc;
}

describe('TEMPLATE', () => {
  it('points to existing template files', () => {
    const paths = collectTemplatePaths(TEMPLATE);
    expect(paths.length).toBeGreaterThan(0);

    for (const rel of paths) {
      const abs = path.join(TEMPLATE_ROOT, rel);
      expect(fs.existsSync(abs), `missing template: ${rel}`).toBe(true);
    }
  });
});
