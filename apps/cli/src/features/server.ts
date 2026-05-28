import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';

export const serverFeature: Feature = {
  id: 'server',
  apply(project) {
    project.addDeps(
      'pino',
      'pino-abstract-transport',
      '@axiomhq/js',
      '@vercel/functions',
      'is-in-subnet',
    );

    const { server: S } = TEMPLATE;
    project.copyRaw(S.merge, 'src/lib/helpers/merge.ts');
    project.copyRaw(S.noop, 'src/lib/helpers/noop.ts');
    project.copyRaw(S.webserver, 'src/config/webserver.ts');
    project.copyRaw(S.errors, 'src/server/errors/index.ts');
    project.copyRaw(S.loggerAxiom, 'src/server/logger/axiom-transport.ts');
    project.copyRaw(S.loggerConfig, 'src/server/logger/config.ts');
    project.copyRaw(S.loggerIndex, 'src/server/logger/index.ts');
    project.copyRaw(S.loggerRedact, 'src/server/logger/redact.ts');
    project.copyRaw(S.ip, 'src/server/ip/index.ts');
  },
};
