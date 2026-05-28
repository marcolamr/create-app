import { execa } from 'execa';

export async function finalizeGit(projectDir: string): Promise<void> {
  const isGit = await execa('git', ['rev-parse', 'HEAD'], {
    cwd: projectDir,
    reject: false,
  }).then((r) => r.exitCode === 0);

  if (!isGit) {
    await execa('git', ['init'], { cwd: projectDir, stdio: 'inherit' });
  }

  await execa('git', ['add', '.'], { cwd: projectDir, stdio: 'inherit' }).catch(
    () => undefined,
  );
}
