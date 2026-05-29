import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseNameAndPath } from './paths.js';

describe('parseNameAndPath', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps dot to cwd basename', () => {
    vi.spyOn(process, 'cwd').mockReturnValue('/projects/my-repo');

    expect(parseNameAndPath('.')).toEqual(['my-repo', '.']);
  });

  it('normalizes simple names', () => {
    expect(parseNameAndPath('My App')).toEqual(['my-app', 'my-app']);
  });

  it('preserves scoped package names', () => {
    expect(parseNameAndPath('@acme/My App')).toEqual(['@acme/My App', '@acme/my-app']);
  });

  it('lowercases directory names', () => {
    const [, dirName] = parseNameAndPath('Cool-App');
    expect(dirName).toBe('cool-app');
    expect(path.basename(dirName)).toBe('cool-app');
  });
});
