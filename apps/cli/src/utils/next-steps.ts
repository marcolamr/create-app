import chalk from 'chalk';

import type { StackOptions } from '../core/types.js';
import { getUserPkgManager } from './pkg-manager.js';

type NextStepsOptions = {
  projectName: string;
  projectDir: string;
  stack: StackOptions;
  noInstall: boolean;
};

export function printNextSteps({
  projectName,
  projectDir,
  stack,
  noInstall,
}: NextStepsOptions): void {
  const pm = getUserPkgManager();
  const cd = projectName === '.' ? projectDir : projectName;

  console.log('\n' + chalk.green.bold('Done!') + '\n');
  console.log(`  cd ${chalk.cyan(cd)}`);

  if (noInstall) {
    console.log(`  ${chalk.cyan(`${pm} install`)}`);
  }

  if (stack.drizzle !== false) {
    if (stack.drizzle === 'postgres') {
      console.log(`  ${chalk.cyan('./start-database.sh')}  # start local Postgres`);
    } else {
      console.log(`  # Set DATABASE_URL from https://console.neon.tech`);
    }
    console.log(`  ${chalk.cyan(`${pm} run db:push`)}`);
  }

  console.log(`  ${chalk.cyan(`${pm} run dev`)}\n`);
}
