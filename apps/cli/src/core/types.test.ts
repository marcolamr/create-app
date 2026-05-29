import { describe, expect, it } from 'vitest';

import { normalizeStack, usesDrizzle } from './types.js';

describe('usesDrizzle', () => {
  it('returns false when drizzle is disabled', () => {
    expect(
      usesDrizzle({
        auth: false,
        authEvents: false,
        drizzle: false,
        tailwind: false,
        eslint: false,
      }),
    ).toBe(false);
  });

  it('returns true for postgres', () => {
    expect(
      usesDrizzle({
        auth: false,
        authEvents: false,
        drizzle: 'postgres',
        tailwind: false,
        eslint: false,
      }),
    ).toBe(true);
  });

  it('returns true for neon', () => {
    expect(
      usesDrizzle({
        auth: false,
        authEvents: false,
        drizzle: 'neon',
        tailwind: false,
        eslint: false,
      }),
    ).toBe(true);
  });
});

describe('normalizeStack', () => {
  it('clears auth when drizzle is disabled', () => {
    expect(
      normalizeStack({
        auth: true,
        authEvents: true,
        drizzle: false,
        tailwind: true,
        eslint: true,
      }),
    ).toEqual({
      auth: false,
      authEvents: false,
      drizzle: false,
      tailwind: true,
      eslint: true,
    });
  });

  it('clears authEvents when auth is disabled', () => {
    expect(
      normalizeStack({
        auth: false,
        authEvents: true,
        drizzle: 'postgres',
        tailwind: true,
        eslint: true,
      }).authEvents,
    ).toBe(false);
  });
});
