import { describe, expect, it } from 'vitest';

import { DEP_VERSIONS } from './versions.js';

describe('DEP_VERSIONS', () => {
  it('pins core stack dependencies', () => {
    expect(DEP_VERSIONS['better-auth']).toBeDefined();
    expect(DEP_VERSIONS['drizzle-orm']).toBeDefined();
    expect(DEP_VERSIONS.tailwindcss).toBeDefined();
    expect(DEP_VERSIONS.eslint).toBeDefined();
  });
});
