import * as p from '@clack/prompts';
import chalk from 'chalk';
import { Command } from 'commander';

import { CLI_BIN_NAME, DEFAULT_APP_NAME, NPM_PACKAGE_NAME } from '@/constants';
import {
  type AvailablePackages,
  type DatabaseProvider,
  databaseProviders,
} from '@/installers/types';
import { IsTTYError } from '@/utils/errors';
import { getUserPkgManager, getVersion } from '@/utils/getter';
import { logger } from '@/utils/logger';
import { validateAppName, validateImportAlias } from '@/utils/validator';

import { CliResults } from './interfaces';

const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  packages: ['tailwind', 'eslint'],
  flags: {
    noGit: false,
    noInstall: false,
    default: false,
    CI: false,
    tailwind: false,
    drizzle: false,
    betterAuth: false,
    importAlias: '@/',
    dbProvider: 'postgres',
    eslint: false,
  },
  databaseProvider: 'postgres',
};

export const run = async (): Promise<CliResults> => {
  const cliResults = defaultOptions;

  const program = new Command()
    .name(CLI_BIN_NAME)
    .description('A CLI for creating web applications with the madda stack')
    .argument(
      '[dir]',
      'The name of the application, as well as the name of the directory to create',
    )
    .option(
      '--noGit',
      'Explicitly tell the CLI to not initialize a new git repo in the project',
      false,
    )
    .option(
      '--noInstall',
      "Explicitly tell the CLI to not run the package manager's install command",
      false,
    )
    .option(
      '-y, --default',
      'Bypass the CLI and use all default options to bootstrap a new madda app',
      false,
    )
    .option(
      '--dbProvider [provider]',
      `Choose a database provider to use. Possible values: ${databaseProviders.join(
        ', ',
      )}`,
      defaultOptions.flags.dbProvider,
    )
    .option(
      '--eslint [boolean]',
      'Experimental: Boolean value if we should install eslint and prettier. Must be used in conjunction with `--CI`.',
      (value: string) => !!value && value !== 'false',
    )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .addHelpText(
      'afterAll',
      `\n The madda stack was inspired by ${chalk
        .hex('#E8DCFF')
        .bold(
          'CHANGE_ME',
        )} and has been used to build awesome fullstack applications like ${chalk
        .hex('#E24A8D')
        .underline('https://ping.gg')} \n`,
    )
    .parse(process.argv);

  // TODO: FIX THIS TEMPORARY WARNING WHEN USING YARN 3. SEE ISSUE #57
  if (process.env.npm_config_user_agent?.startsWith('yarn/3')) {
    logger.warn(`  WARNING: It looks like you are using Yarn 3. This is currently not supported,
  and likely to result in a crash. Please run create-t3-app with another
  package manager such as pnpm, npm, or Yarn Classic.
  See: https://github.com/t3-oss/create-t3-app/issues/57`);
  }

  // Needs to be separated outside the if statement to correctly infer the type as string | undefined
  const cliProvidedName = program.args[0];
  if (cliProvidedName) {
    cliResults.appName = cliProvidedName;
  }

  cliResults.flags = {
    ...cliResults.flags,
    ...program.opts(),
  };

  if (cliResults.flags.default) {
    return cliResults;
  }

  // Explained below why this is in a try/catch block
  try {
    if (process.env.TERM_PROGRAM?.toLowerCase().includes('mintty')) {
      logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal. Alternatively, you
  can provide the arguments from the CLI directly: https://create.t3.gg/en/installation#experimental-usage to skip the prompts.`);

      throw new IsTTYError('Non-interactive environment');
    }

    // if --CI flag is set, we are running in CI mode and should not prompt the user

    const pkgManager = getUserPkgManager();

    const project = await p.group(
      {
        ...(!cliProvidedName && {
          name: () =>
            p.text({
              message: 'What will your project be called?',
              defaultValue: cliProvidedName,
              validate: validateAppName,
            }),
        }),
        language: () => {
          return p.select({
            message: 'Will you be using TypeScript or JavaScript?',
            options: [
              { value: 'typescript', label: 'TypeScript' },
              { value: 'javascript', label: 'JavaScript' },
            ],
            initialValue: 'typescript',
          });
        },
        _: async ({ results }) =>
          results.language === 'javascript'
            ? p.note(chalk.redBright('Wrong answer, using TypeScript instead'))
            : undefined,
        styling: () => {
          return p.confirm({
            message: 'Will you be using Tailwind CSS for styling?',
          });
        },
        authentication: () => {
          return p.select({
            message: 'What authentication provider would you like to use?',
            options: [
              { value: 'none', label: 'None' },
              { value: 'better-auth', label: 'BetterAuth' },
            ],
            initialValue: 'better-auth',
          });
        },
        database: () => {
          return p.select({
            message: 'What database ORM would you like to use?',
            options: [
              { value: 'none', label: 'None' },
              { value: 'drizzle', label: 'Drizzle' },
            ],
            initialValue: 'drizzle',
          });
        },
        databaseProvider: ({ results }) => {
          if (results.database === 'none') return;
          return p.select({
            message: 'What database provider would you like to use?',
            options: [{ value: 'postgres', label: 'PostgreSQL' }],
            initialValue: 'postgres',
          });
        },
        linter: () => {
          return p.select({
            message:
              'Would you like to use ESLint and Prettier for linting and formatting?',
            options: [{ value: 'eslint', label: 'ESLint/Prettier' }],
            initialValue: 'eslint',
          });
        },
        ...(!cliResults.flags.noGit && {
          git: () => {
            return p.confirm({
              message: 'Should we initialize a Git repository and stage the changes?',
              initialValue: !defaultOptions.flags.noGit,
            });
          },
        }),
        ...(!cliResults.flags.noInstall && {
          install: () => {
            return p.confirm({
              message:
                `Should we run '${pkgManager}` +
                (pkgManager === 'yarn' ? `'?` : ` install' for you?`),
              initialValue: !defaultOptions.flags.noInstall,
            });
          },
        }),
        importAlias: () => {
          return p.text({
            message: 'What import alias would you like to use?',
            initialValue: defaultOptions.flags.importAlias,
            defaultValue: defaultOptions.flags.importAlias,
            validate: validateImportAlias,
          });
        },
      },
      {
        onCancel() {
          process.exit(1);
        },
      },
    );

    const packages: AvailablePackages[] = [];
    if (project.styling) packages.push('tailwind');
    if (project.authentication === 'better-auth') packages.push('betterAuth');
    if (project.database === 'drizzle') packages.push('drizzle');
    if (project.linter === 'eslint') packages.push('eslint');

    return {
      appName: project.name ?? cliResults.appName,
      packages,
      databaseProvider: (project.databaseProvider as DatabaseProvider) || 'postgres',
      flags: {
        ...cliResults.flags,
        noGit: !project.git || cliResults.flags.noGit,
        noInstall: !project.install || cliResults.flags.noInstall,
        importAlias: project.importAlias ?? cliResults.flags.importAlias,
      },
    };
  } catch (err) {
    // If the user is not calling create-t3-app from an interactive terminal, inquirer will throw an IsTTYError
    // If this happens, we catch the error, tell the user what has happened, and then continue to run the program with a default t3 app
    if (err instanceof IsTTYError) {
      logger.warn(`
  ${NPM_PACKAGE_NAME} needs an interactive terminal to provide options`);

      const shouldContinue = await p.confirm({
        message: `Continue scaffolding a default madda app?`,
        initialValue: true,
      });

      if (!shouldContinue) {
        logger.info('Exiting...');
        process.exit(0);
      }

      logger.info(`Bootstrapping a default madda app in ./${cliResults.appName}`);
    } else {
      throw err;
    }
  }

  return cliResults;
};
