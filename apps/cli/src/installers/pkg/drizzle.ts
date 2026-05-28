import fs from 'fs-extra';
import path from 'node:path';

import { PKG_ROOT } from '@/constants';
import { type Installer } from '@/installers/types';
import { addPackageDependency, addPackageScript } from '@/utils/adder';

import { type AvailableDependencies } from './dependency-map';

export const drizzleInstaller: Installer = ({
  projectDir,
  packages,
  scopedAppName,
  databaseProvider,
}) => {
  addPackageDependency({
    projectDir,
    dependencies: ['drizzle-kit'],
    devMode: true,
  });

  const usingBetterAuth = packages?.betterAuth.inUse;

  const runtimeDependencies: AvailableDependencies[] = [
    'drizzle-orm',
    (
      {
        postgres: 'postgres',
      } as const
    )[databaseProvider],
    ...(usingBetterAuth ? (['@paralleldrive/cuid2'] as const) : []),
  ];

  addPackageDependency({
    projectDir,
    dependencies: runtimeDependencies,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, 'template/extras');
  const schemaTemplateDir = path.join(extrasDir, 'src/server/db/schema-drizzle');
  const dbDir = path.join(projectDir, 'src/server/db');
  const schemaDir = path.join(dbDir, 'schema');

  const configFile = path.join(extrasDir, `config/drizzle-config-${databaseProvider}.ts`);
  const configDest = path.join(projectDir, 'drizzle.config.ts');

  let configContent = fs.readFileSync(configFile, 'utf-8');
  configContent = configContent.replace('project1_*', `${scopedAppName}_*`);

  const clientSrc = path.join(
    extrasDir,
    `src/server/db/index-drizzle/with-${databaseProvider}.ts`,
  );
  const clientDest = path.join(dbDir, 'index.ts');

  addPackageScript({
    projectDir,
    scripts: {
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
    },
  });

  fs.mkdirSync(schemaDir, { recursive: true });

  if (usingBetterAuth) {
    fs.copySync(path.join(extrasDir, 'src/server/db/columns.ts'), path.join(dbDir, 'columns.ts'));
    fs.copySync(
      path.join(schemaTemplateDir, 'auth-postgres.ts'),
      path.join(schemaDir, 'auth.ts'),
    );
    fs.copySync(
      path.join(schemaTemplateDir, 'index-auth.ts'),
      path.join(schemaDir, 'index.ts'),
    );
  } else {
    let postsContent = fs.readFileSync(
      path.join(schemaTemplateDir, 'posts-postgres.ts'),
      'utf-8',
    );
    postsContent = postsContent.replace('project1_${name}', `${scopedAppName}_\${name}`);
    fs.writeFileSync(path.join(schemaDir, 'posts.ts'), postsContent);
    fs.copySync(
      path.join(schemaTemplateDir, 'index-base.ts'),
      path.join(schemaDir, 'index.ts'),
    );
  }

  fs.writeFileSync(configDest, configContent);
  fs.copySync(clientSrc, clientDest);
};
