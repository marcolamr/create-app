import chalk from 'chalk';
import { execSync } from 'node:child_process';
import https from 'node:https';

import { getVersion } from './pkg-manager.js';

export const NPM_PACKAGE_NAME = '@madda/app';

export function getLatestNpmVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(NPM_PACKAGE_NAME);
    const req = https.get(
      `https://registry.npmjs.org/-/package/${encoded}/dist-tags`,
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          resolve(fallbackNpmVersion());
          return;
        }

        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve((JSON.parse(body) as { latest: string }).latest);
          } catch {
            resolve(fallbackNpmVersion());
          }
        });
      },
    );

    req.on('error', () => resolve(fallbackNpmVersion()));
    req.setTimeout(5_000, () => {
      req.destroy();
      resolve(fallbackNpmVersion());
    });
  });
}

function fallbackNpmVersion(): string | null {
  try {
    return execSync(`npm view ${NPM_PACKAGE_NAME} version`, {
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

export function printVersionWarning(latestVersion: string): void {
  const currentVersion = getVersion();

  if (currentVersion.includes('beta')) {
    console.warn(chalk.yellow(`  You are using a beta version of ${NPM_PACKAGE_NAME}.`));
    console.warn(chalk.yellow('  Please report any bugs you encounter.'));
  } else if (currentVersion.includes('next')) {
    console.warn(
      chalk.yellow(
        `  You are running ${NPM_PACKAGE_NAME} with the @next tag which is no longer maintained.`,
      ),
    );
    console.warn(chalk.yellow('  Please run the CLI with @latest instead.'));
  } else if (currentVersion !== latestVersion) {
    console.warn(
      chalk.yellow(`  You are using an outdated version of ${NPM_PACKAGE_NAME}.`),
    );
    console.warn(
      chalk.yellow(`  Your version: ${currentVersion}. Latest on npm: ${latestVersion}.`),
    );
    console.warn(chalk.yellow('  Run with @latest to get the latest updates.'));
  }

  console.log('');
}
