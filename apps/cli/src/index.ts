import chalk from 'chalk';

import { createProject } from './create-project';
import { ensureEmptyOrConfirm, runCli } from './prompts';
import { renderTitle } from './utils/title';
import { getLatestNpmVersion, printVersionWarning } from './utils/version-warning';

async function main(): Promise<void> {
  console.log(renderTitle() + '\n');

  const latestVersion = await getLatestNpmVersion();
  if (latestVersion) {
    printVersionWarning(latestVersion);
  }

  const input = await runCli(process.argv);
  await ensureEmptyOrConfirm(input.appName);
  await createProject(input);
}

main()
  .then(() => {
    // @clack/prompts keeps stdin listeners open; exit explicitly when done.
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error(chalk.red('\nAborting.'));
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
