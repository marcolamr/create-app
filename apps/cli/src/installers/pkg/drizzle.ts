import fs from 'fs-extra';
import path from 'node:path';

import { PKG_ROOT } from '@/constants';
import { type Installer } from '@/installers/types';
import { addPackageDependency, addPackageScript } from '@/utils/adder';

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
  addPackageDependency({
    projectDir,
    dependencies: [
      'drizzle-orm',
      (
        {
          postgres: 'postgres',
        } as const
      )[databaseProvider],
    ],
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, 'template/extras');

  const configFile = path.join(extrasDir, `config/drizzle-config-${databaseProvider}.ts`);
  const configDest = path.join(projectDir, 'drizzle.config.ts');

  const schemaBaseName = packages?.betterAuth.inUse ? 'with-better-auth' : 'base';
  const schemaSrc = path.join(
    extrasDir,
    'src/server/db/schema-drizzle',
    `${schemaBaseName}-${databaseProvider}.ts`,
  );
  const schemaDest = path.join(projectDir, 'src/server/db/schema.ts');

  // Replace placeholder table prefix with project name
  let schemaContent = fs.readFileSync(schemaSrc, 'utf-8');
  schemaContent = schemaContent.replace('project1_${name}', `${scopedAppName}_\${name}`);

  let configContent = fs.readFileSync(configFile, 'utf-8');

  configContent = configContent.replace('project1_*', `${scopedAppName}_*`);

  const clientSrc = path.join(
    extrasDir,
    `src/server/db/index-drizzle/with-${databaseProvider}.ts`,
  );
  const clientDest = path.join(projectDir, 'src/server/db/index.ts');

  addPackageScript({
    projectDir,
    scripts: {
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
    },
  });

  fs.copySync(configFile, configDest);
  fs.mkdirSync(path.dirname(schemaDest), { recursive: true });
  fs.writeFileSync(schemaDest, schemaContent);
  fs.writeFileSync(configDest, configContent);
  fs.copySync(clientSrc, clientDest);
};
