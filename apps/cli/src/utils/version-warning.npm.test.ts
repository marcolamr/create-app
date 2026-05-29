import { describe, expect, it, vi } from 'vitest';

vi.mock('node:https', () => ({
  default: {
    get: (_url: string, cb: (res: unknown) => void) => {
      cb({
        statusCode: 200,
        on(event: string, handler: (chunk?: string) => void) {
          if (event === 'data') handler(JSON.stringify({ latest: '9.9.9' }));
          if (event === 'end') handler();
        },
        resume: () => undefined,
      });
      return {
        on: () => undefined,
        setTimeout: () => undefined,
        destroy: () => undefined,
      };
    },
  },
}));

import { getLatestNpmVersion } from './version-warning.js';

describe('getLatestNpmVersion', () => {
  it('returns latest from npm registry', async () => {
    await expect(getLatestNpmVersion()).resolves.toBe('9.9.9');
  });
});
