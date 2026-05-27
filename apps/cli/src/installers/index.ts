import {
  betterAuthInstaller,
  dbContainerInstaller,
  drizzleInstaller,
  dynamicEslintInstaller,
  envVariablesInstaller,
  tailwindInstaller,
} from './pkg';
import { AvailablePackages, DatabaseProvider, PkgInstallerMap } from './types';

export const buildPkgInstallerMap = (
  packages: AvailablePackages[],
  databaseProvider: DatabaseProvider,
): PkgInstallerMap => ({
  betterAuth: {
    inUse: packages.includes('betterAuth'),
    installer: betterAuthInstaller,
  },
  drizzle: {
    inUse: packages.includes('drizzle'),
    installer: drizzleInstaller,
  },
  tailwind: {
    inUse: packages.includes('tailwind'),
    installer: tailwindInstaller,
  },
  dbContainer: {
    inUse: ['mysql', 'postgres'].includes(databaseProvider),
    installer: dbContainerInstaller,
  },
  envVariables: {
    inUse: true,
    installer: envVariablesInstaller,
  },
  eslint: {
    inUse: packages.includes('eslint'),
    installer: dynamicEslintInstaller,
  },
});
