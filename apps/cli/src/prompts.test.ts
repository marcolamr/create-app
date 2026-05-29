import { describe, expect, it } from 'vitest';

import { MINIMAL_STACK, runCli } from './prompts.js';

describe('runCli', () => {
  it('uses default stack with --default', async () => {
    const input = await runCli([
      'node',
      'madda-app',
      'demo-app',
      '--default',
      '--no-git',
    ]);

    expect(input.appName).toBe('demo-app');
    expect(input.stack).toEqual({
      auth: true,
      authEvents: false,
      drizzle: 'postgres',
      tailwind: true,
      eslint: true,
    });
    expect(input.flags.noGit).toBe(true);
    expect(input.flags.defaults).toBe(true);
  });

  it('uses minimal stack when stdin is not a TTY', async () => {
    const isTTY = process.stdin.isTTY;
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });

    try {
      const input = await runCli(['node', 'madda-app', 'ci-app']);
      expect(input.stack).toEqual(MINIMAL_STACK);
    } finally {
      Object.defineProperty(process.stdin, 'isTTY', { value: isTTY, configurable: true });
    }
  });

  it('respects --no-install', async () => {
    const input = await runCli([
      'node',
      'madda-app',
      'demo-app',
      '--default',
      '--no-install',
    ]);

    expect(input.flags.noInstall).toBe(true);
  });

  it('accepts custom import alias', async () => {
    const input = await runCli([
      'node',
      'madda-app',
      'demo-app',
      '--default',
      '--import-alias',
      '~/',
    ]);

    expect(input.flags.importAlias).toBe('~/');
  });
});

describe('ensureEmptyOrConfirm', () => {
  it('passes for missing directories', async () => {
    const { ensureEmptyOrConfirm } = await import('./prompts.js');
    await expect(ensureEmptyOrConfirm('non-existent-dir-xyz')).resolves.toBeUndefined();
  });
});
