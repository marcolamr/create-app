import { execSync } from 'child_process';
import https from 'https';

import { NPM_PACKAGE_NAME } from '@/constants';
import { getVersion } from '@/utils/getter';
import { logger } from '@/utils/logger';

const NPM_REGISTRY_PACKAGE = encodeURIComponent(NPM_PACKAGE_NAME);

export const renderVersionWarning = (npmVersion: string) => {
  const currentVersion = getVersion();

  if (currentVersion.includes('beta')) {
    logger.warn(`  You are using a beta version of ${NPM_PACKAGE_NAME}.`);
    logger.warn('  Please report any bugs you encounter.');
  } else if (currentVersion.includes('next')) {
    logger.warn(
      `  You are running ${NPM_PACKAGE_NAME} with the @next tag which is no longer maintained.`,
    );
    logger.warn('  Please run the CLI with @latest instead.');
  } else if (currentVersion !== npmVersion) {
    logger.warn(`  You are using an outdated version of ${NPM_PACKAGE_NAME}.`);
    logger.warn(
      '  Your version:',
      currentVersion + '.',
      'Latest version in the npm registry:',
      npmVersion,
    );
    logger.warn('  Please run the CLI with @latest to get the latest updates.');
  }
  console.log('');
};

interface DistTagsBody {
  latest: string;
}

function checkForLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://registry.npmjs.org/-/package/${NPM_REGISTRY_PACKAGE}/dist-tags`,
        (res) => {
          if (res.statusCode === 200) {
            let body = '';
            res.on('data', (data) => (body += data));
            res.on('end', () => {
              resolve((JSON.parse(body) as DistTagsBody).latest);
            });
          } else {
            reject();
          }
        },
      )
      .on('error', () => {
        reject();
      });
  });
}

export const getNpmVersion = () =>
  checkForLatestVersion().catch(() => {
    try {
      return execSync(`npm view ${NPM_PACKAGE_NAME} version`).toString().trim();
    } catch {
      return null;
    }
  });
