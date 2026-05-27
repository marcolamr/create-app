import { DEFAULT_APP_NAME } from '@/constants';
import type { InstallerOptions } from '@/installers/types';
import { getUserPkgManager } from '@/utils/getter';
import { logger } from '@/utils/logger';

import { isInsideGitRepo, isRootGitRepo } from './git';

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = async ({
  projectName = DEFAULT_APP_NAME,
  packages,
  noInstall,
  projectDir,
  databaseProvider,
}: Pick<
  InstallerOptions,
  | 'projectName'
  | 'packages'
  | 'noInstall'
  | 'projectDir'
  | 'appRouter'
  | 'databaseProvider'
>) => {
  const pkgManager = getUserPkgManager();

  logger.info('Next steps:');
  if (projectName !== '.') {
    logger.info(`  cd ${projectName}`);
  }
  if (noInstall) {
    // To reflect yarn's default behavior of installing packages when no additional args provided
    if (pkgManager === 'yarn') {
      logger.info(`  ${pkgManager}`);
    } else {
      logger.info(`  ${pkgManager} install`);
    }
  }

  if (['postgres', 'mysql'].includes(databaseProvider)) {
    logger.info("  Start up a database, if needed using './start-database.sh'");
  }

  if (packages?.drizzle.inUse) {
    if (['npm', 'bun'].includes(pkgManager)) {
      logger.info(`  ${pkgManager} run db:push`);
    } else {
      logger.info(`  ${pkgManager} db:push`);
    }
  }

  if (packages?.betterAuth.inUse) {
    logger.info(
      `  Fill in your .env with necessary values. See https://create.t3.gg/en/usage/first-steps for more info.`,
    );
  }

  if (['npm', 'bun'].includes(pkgManager)) {
    logger.info(`  ${pkgManager} run dev`);
  } else {
    logger.info(`  ${pkgManager} dev`);
  }

  if (!(await isInsideGitRepo(projectDir)) && !isRootGitRepo(projectDir)) {
    logger.info(`  git init`);
  }
  logger.info(`  git commit -m "initial commit"`);
};
