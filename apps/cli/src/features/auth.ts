import fs from 'fs-extra';
import path from 'node:path';

import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';

export const authFeature: Feature = {
  id: 'auth',
  when: (stack) => stack.auth,
  apply(project) {
    project.addDeps('better-auth');

    const { auth: A } = TEMPLATE;
    project.copyRaw(A.route, 'src/app/api/auth/[...all]/route.ts');
    project.copyRaw(A.index, 'src/server/better-auth/index.ts');
    project.copyRaw(A.client, 'src/server/better-auth/client.ts');
    project.copyRaw(A.server, 'src/server/better-auth/server.ts');

    const configTemplate = project.usesDrizzle() ? A.configDrizzle : A.configBase;
    project.copyRaw(configTemplate, 'src/server/better-auth/config.ts');

    if (project.usesDrizzle()) {
      const configPath = path.join(project.dir, 'src/server/better-auth/config.ts');
      const content = fs.readFileSync(configPath, 'utf8');
      fs.writeFileSync(
        configPath,
        content.replace(/(provider:\s*")[^"]+("\s*,?)/, '$1pg$2'),
      );
    }
  },
};
