import fs from 'fs-extra';
import path from 'node:path';

import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';
import { usesDrizzle } from '../core/types.js';

const MODEL_DEST: Record<keyof typeof TEMPLATE.auth.models, string> = {
  authentication: 'src/models/authentication.ts',
  authorization: 'src/models/authorization.ts',
  controller: 'src/models/controller.ts',
  password: 'src/models/password.ts',
  removeMarkdown: 'src/models/remove-markdown.ts',
  userFeatures: 'src/models/user-features.ts',
  validator: 'src/models/validator.ts',
};

export const authFeature: Feature = {
  id: 'auth',
  when: (stack) => stack.auth && usesDrizzle(stack),
  apply(project) {
    project.addDeps('better-auth', '@node-rs/argon2', 'cookie', 'joi', 'remove-markdown');

    const { auth: A } = TEMPLATE;
    const authDir = 'src/server/auth';

    project.copyRaw(A.route, 'src/app/api/v1/auth/[...all]/route.ts');
    project.copyRaw(A.index, `${authDir}/index.ts`);
    project.copyRaw(A.client, `${authDir}/client.ts`);
    project.copyRaw(A.server, `${authDir}/server.ts`);
    project.copyRaw(A.defaultUserFeatures, `${authDir}/default-user-features.ts`);
    project.copyRaw(
      A.recordUserCreatedEventNoop,
      `${authDir}/record-user-created-event.ts`,
    );
    project.copyRaw(A.firewallCreateUserNoop, 'src/server/db/firewall/create-user.ts');

    for (const plugin of A.plugins) {
      project.copyRaw(plugin, path.join(authDir, 'plugins', path.basename(plugin)));
    }

    for (const [key, templatePath] of Object.entries(A.models)) {
      project.copyRaw(templatePath, MODEL_DEST[key as keyof typeof A.models]);
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
