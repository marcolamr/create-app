import { AvailablePackages, DatabaseProvider } from '@/installers/types';

export interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  default: boolean;
  importAlias: string;

  /** @internal Used in CI. */
  CI: boolean;
  /** @internal Used in CI. */
  tailwind: boolean;
  /** @internal Used in CI. */
  drizzle: boolean;
  /** @internal Used in CI. */
  betterAuth: boolean;
  /** @internal Used in CI. */
  dbProvider: DatabaseProvider;
  /** @internal Used in CI */
  eslint: boolean;
}

export interface CliResults {
  appName: string;
  packages: AvailablePackages[];
  flags: CliFlags;
  databaseProvider: DatabaseProvider;
}
