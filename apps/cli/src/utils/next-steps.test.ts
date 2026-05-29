import { afterEach, describe, expect, it, vi } from 'vitest';

import { printNextSteps } from './next-steps.js';

describe('printNextSteps', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prints install hint when skipped', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    process.env.npm_config_user_agent = 'pnpm/9.0.0';

    printNextSteps({
      projectName: 'demo',
      projectDir: '/tmp/demo',
      stack: { auth: false, drizzle: false, tailwind: false, eslint: false },
      noInstall: true,
    });

    expect(log).toHaveBeenCalledWith(expect.stringContaining('pnpm install'));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('pnpm run dev'));
  });

  it('includes drizzle postgres steps', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    process.env.npm_config_user_agent = 'npm/10.0.0';

    printNextSteps({
      projectName: 'demo',
      projectDir: '/tmp/demo',
      stack: { auth: false, drizzle: 'postgres', tailwind: false, eslint: false },
      noInstall: false,
    });

    expect(log).toHaveBeenCalledWith(expect.stringContaining('./start-database.sh'));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('npm run db:push'));
  });

  it('includes neon hint for serverless drizzle', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    process.env.npm_config_user_agent = 'npm/10.0.0';

    printNextSteps({
      projectName: '.',
      projectDir: '/tmp/demo',
      stack: { auth: false, drizzle: 'neon', tailwind: false, eslint: false },
      noInstall: false,
    });

    expect(log).toHaveBeenCalledWith(expect.stringContaining('console.neon.tech'));
  });
});
