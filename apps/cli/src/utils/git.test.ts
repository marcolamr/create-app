import { describe, expect, it, vi } from 'vitest';

import { finalizeGit } from './git.js';

const execaMock = vi.fn();

vi.mock('execa', () => ({
  execa: (...args: unknown[]) => execaMock(...args),
}));

describe('finalizeGit', () => {
  it('initializes git when repository is missing', async () => {
    execaMock
      .mockResolvedValueOnce({ exitCode: 1 })
      .mockResolvedValueOnce({ exitCode: 0 })
      .mockResolvedValueOnce({ exitCode: 0 });

    await finalizeGit('/tmp/project');

    expect(execaMock).toHaveBeenCalledWith(
      'git',
      ['rev-parse', 'HEAD'],
      expect.any(Object),
    );
    expect(execaMock).toHaveBeenCalledWith('git', ['init'], expect.any(Object));
    expect(execaMock).toHaveBeenCalledWith('git', ['add', '.'], expect.any(Object));
  });

  it('skips init when git already exists', async () => {
    execaMock.mockReset();
    execaMock
      .mockResolvedValueOnce({ exitCode: 0 })
      .mockResolvedValueOnce({ exitCode: 0 });

    await finalizeGit('/tmp/project');

    expect(execaMock).not.toHaveBeenCalledWith('git', ['init'], expect.any(Object));
    expect(execaMock).toHaveBeenCalledWith('git', ['add', '.'], expect.any(Object));
  });
});
