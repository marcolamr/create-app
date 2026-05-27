import type { PackageManager } from '@/utils/getter';

export const availablePackages = [
  'betterAuth',
  'drizzle',
  'tailwind',
  'envVariables',
  'eslint',
  'dbContainer',
] as const;
export type AvailablePackages = (typeof availablePackages)[number];

export const databaseProviders = ['postgres'] as const;
export type DatabaseProvider = (typeof databaseProviders)[number];

export interface InstallerOptions {
  projectDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  packages?: PkgInstallerMap;
  appRouter?: boolean;
  projectName: string;
  scopedAppName: string;
  databaseProvider: DatabaseProvider;
}

export type Installer = (opts: InstallerOptions) => void;

export type PkgInstallerMap = Record<
  AvailablePackages,
  {
    inUse: boolean;
    installer: Installer;
  }
>;
