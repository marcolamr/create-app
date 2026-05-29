import { describe, expect, it } from 'vitest';

import { usesDrizzle } from './types.js';

describe('usesDrizzle', () => {
  it('returns false when drizzle is disabled', () => {
    expect(
      usesDrizzle({ auth: false, drizzle: false, tailwind: false, eslint: false }),
    ).toBe(false);
  });

  it('returns true for postgres', () => {
    expect(
      usesDrizzle({ auth: false, drizzle: 'postgres', tailwind: false, eslint: false }),
    ).toBe(true);
  });

  it('returns true for neon', () => {
    expect(
      usesDrizzle({ auth: false, drizzle: 'neon', tailwind: false, eslint: false }),
    ).toBe(true);
  });
});
