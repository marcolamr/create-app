import fs from 'fs-extra';
import path from 'node:path';

import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';
import { usesDrizzle } from '../core/types.js';

export const authFeature: Feature = {
  id: 'auth',
  when: (stack) => stack.auth && usesDrizzle(stack),
  apply(project) {
    project.addDeps('better-auth', '@node-rs/argon2');

    const { auth: A } = TEMPLATE;
    const authDir = 'src/server/auth';

    project.copyRaw(A.route, 'src/app/api/auth/[...all]/route.ts');
    project.copyRaw(A.index, `${authDir}/index.ts`);
    project.copyRaw(A.client, `${authDir}/client.ts`);
    project.copyRaw(A.server, `${authDir}/server.ts`);
    project.copyRaw(A.defaultUserFeatures, `${authDir}/default-user-features.ts`);
    project.copyRaw(A.password, 'src/models/password.ts');

    for (const plugin of A.plugins) {
      project.copyRaw(plugin, path.join(authDir, 'plugins', path.basename(plugin)));
    }

    project.copyRaw(A.config, `${authDir}/config.ts`);

    const configPath = path.join(project.dir, authDir, 'config.ts');
    const content = fs.readFileSync(configPath, 'utf8');
    fs.writeFileSync(
      configPath,
      content.replace(/(provider:\s*")[^"]+("\s*,?)/, '$1pg$2'),
    );
  },
};
