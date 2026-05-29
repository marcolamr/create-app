import { afterEach, describe, expect, it } from 'vitest';

import { getUserPkgManager, getVersion } from './pkg-manager.js';

describe('getUserPkgManager', () => {
  const original = process.env.npm_config_user_agent;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.npm_config_user_agent;
    } else {
      process.env.npm_config_user_agent = original;
    }
  });

  it('detects pnpm', () => {
    process.env.npm_config_user_agent = 'pnpm/9.0.0';
    expect(getUserPkgManager()).toBe('pnpm');
  });

  it('detects yarn', () => {
    process.env.npm_config_user_agent = 'yarn/1.22.0';
    expect(getUserPkgManager()).toBe('yarn');
  });

  it('detects bun', () => {
    process.env.npm_config_user_agent = 'bun/1.0.0';
    expect(getUserPkgManager()).toBe('bun');
  });

  it('defaults to npm', () => {
    delete process.env.npm_config_user_agent;
    expect(getUserPkgManager()).toBe('npm');
  });
});

describe('getVersion', () => {
  it('reads version from package.json', () => {
    expect(getVersion()).toMatch(/^\d+\.\d+\.\d+/);
  });
});
