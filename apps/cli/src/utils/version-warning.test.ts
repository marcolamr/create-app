import { afterEach, describe, expect, it, vi } from 'vitest';

import * as pkgManager from './pkg-manager.js';
import { NPM_PACKAGE_NAME, printVersionWarning } from './version-warning.js';

describe('printVersionWarning', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns on beta versions', () => {
    vi.spyOn(pkgManager, 'getVersion').mockReturnValue('2.0.0-beta.1');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    printVersionWarning('2.0.0');

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(`beta version of ${NPM_PACKAGE_NAME}`),
    );
    expect(log).toHaveBeenCalled();
  });

  it('warns on next versions', () => {
    vi.spyOn(pkgManager, 'getVersion').mockReturnValue('2.0.0-next.1');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    printVersionWarning('2.0.0');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('@next tag'));
  });

  it('warns when outdated', () => {
    vi.spyOn(pkgManager, 'getVersion').mockReturnValue('1.0.0');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    printVersionWarning('2.0.0');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('outdated version'));
  });

  it('stays quiet when up to date', () => {
    vi.spyOn(pkgManager, 'getVersion').mockReturnValue('2.0.0');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    printVersionWarning('2.0.0');

    expect(warn).not.toHaveBeenCalled();
  });
});
