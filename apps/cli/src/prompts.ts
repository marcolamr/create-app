import * as p from '@clack/prompts';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';

import type { CreateFlags, CreateInput, DrizzleOption, StackOptions } from './core/types';
import { parseNameAndPath } from './utils/paths';
import { getVersion } from './utils/pkg-manager';
import { validateAppName } from './utils/validate';

export const DEFAULT_STACK: StackOptions = {
  auth: true,
  drizzle: 'postgres',
  tailwind: true,
  eslint: true,
};

export const MINIMAL_STACK: StackOptions = {
  auth: false,
  drizzle: false,
  tailwind: true,
  eslint: true,
};

export async function runCli(argv: string[]): Promise<CreateInput> {
  const program = new Command()
    .name('madda-app')
    .description('Scaffold a Next.js app with the madda stack')
    .version(getVersion())
    .argument('[dir]', 'Project directory', 'my-app')
    .option('--default', 'Use default stack without prompts')
    .option('--no-git', 'Skip git init')
    .option('--no-install', 'Skip dependency install')
    .option('--import-alias <alias>', 'Import alias', '@/')
    .parse(argv);

  const dir = program.args[0] ?? 'my-app';
  const opts = program.opts<{
    default?: boolean;
    git?: boolean;
    install?: boolean;
    importAlias: string;
  }>();

  const flags: CreateFlags = {
    noGit: opts.git === false,
    noInstall: opts.install === false,
    importAlias: opts.importAlias,
    defaults: Boolean(opts.default),
  };

  if (flags.defaults || !process.stdin.isTTY) {
    return {
      appName: dir,
      stack: flags.defaults ? DEFAULT_STACK : MINIMAL_STACK,
      flags,
    };
  }

  p.intro('create madda app');

  const name = await p.text({
    message: 'Project name',
    placeholder: dir,
    defaultValue: dir,
    validate: validateAppName,
  });
  if (p.isCancel(name)) process.exit(0);

  const stack = await p.group(
    {
      tailwind: () => p.confirm({ message: 'Tailwind CSS?', initialValue: true }),
      eslint: () => p.confirm({ message: 'ESLint + Prettier?', initialValue: true }),
      auth: () => p.confirm({ message: 'Better Auth?', initialValue: true }),
      drizzle: async () => {
        const value = await p.select({
          message: 'Database (Drizzle ORM)?',
          options: [
            { label: 'None', value: 'none' },
            { label: 'PostgreSQL (local Docker)', value: 'postgres' },
            { label: 'Neon (serverless Postgres)', value: 'neon' },
          ],
          initialValue: 'postgres',
        });
        if (p.isCancel(value)) process.exit(0);
        return (value === 'none' ? false : value) as DrizzleOption;
      },
    },
    {
      onCancel: () => {
        p.cancel('Cancelled.');
        process.exit(0);
      },
    },
  );

  const git = await p.confirm({ message: 'Initialize git?', initialValue: true });
  if (p.isCancel(git)) process.exit(0);

  const install = await p.confirm({ message: 'Run install?', initialValue: true });
  if (p.isCancel(install)) process.exit(0);

  flags.noGit = !git;
  flags.noInstall = !install;

  p.outro('Scaffolding...');

  return {
    appName: name,
    stack: stack as StackOptions,
    flags,
  };
}

export async function ensureEmptyOrConfirm(appName: string): Promise<void> {
  const [, dirName] = parseNameAndPath(appName);
  const projectDir = path.resolve(process.cwd(), dirName);

  if (!fs.existsSync(projectDir) || fs.readdirSync(projectDir).length === 0) return;

  const action = await p.select({
    message: `${appName} exists and is not empty. Continue?`,
    options: [
      { label: 'Abort', value: 'abort' },
      { label: 'Clear directory', value: 'clear' },
      { label: 'Overwrite files', value: 'overwrite' },
    ],
  });
  if (p.isCancel(action) || action === 'abort') process.exit(1);
  if (action === 'clear') fs.emptyDirSync(projectDir);
}
