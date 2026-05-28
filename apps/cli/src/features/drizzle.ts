import fs from 'fs-extra';
import path from 'node:path';

import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';
import { usesDrizzle } from '../core/types.js';

export const drizzleFeature: Feature = {
  id: 'drizzle',
  when: usesDrizzle,
  apply(project) {
    const provider = project.drizzleProvider;

    project.addDevDeps('drizzle-kit');
    project.addDeps('drizzle-orm');

    if (provider === 'postgres') {
      project.addDeps('postgres');
    } else {
      project.addDeps('@neondatabase/serverless');
    }

    if (project.has('auth')) {
      project.addDeps('@paralleldrive/cuid2');
    }

    project.addScripts({
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
    });

    const { drizzle: D } = TEMPLATE;
    project.copy(D.config, 'drizzle.config.ts');

    const clientTemplate = provider === 'neon' ? D.clientNeon : D.clientPostgres;
    project.copyRaw(clientTemplate, 'src/server/db/index.ts');

    if (project.has('auth')) {
      project.copyRaw(D.columns, 'src/server/db/columns.ts');
      project.copyRaw(D.schemaAuth, 'src/server/db/schema/auth.ts');
      project.copyRaw(D.schemaIndexAuth, 'src/server/db/schema/index.ts');
    } else {
      project.copy(D.schemaPosts, 'src/server/db/schema/posts.ts');
      project.copyRaw(D.schemaIndexBase, 'src/server/db/schema/index.ts');
    }

    if (provider === 'postgres') {
      const script = fs.readFileSync(project.tpl(D.startDatabase), 'utf8');
      const sanitized = project.name.replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
      project.write('start-database.sh', script.replaceAll('project1', sanitized));
      try {
        fs.chmodSync(path.join(project.dir, 'start-database.sh'), 0o755);
      } catch {
        // Windows
      }
    }
  },
};
