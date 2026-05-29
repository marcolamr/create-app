import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';
import { usesDrizzle } from '../core/types.js';

export const authEventsFeature: Feature = {
  id: 'auth-events',
  when: (stack) => stack.authEvents && stack.auth && usesDrizzle(stack),
  apply(project) {
    project.addDevDeps('tsx', 'dotenv');

    project.addScripts({
      'db:sql': 'tsx scripts/apply-sql.ts',
      'db:sql:firewall': 'tsx scripts/apply-sql.ts firewall_create_user.sql',
    });

    const { drizzle: D, repositories: R, authEvents: AE } = TEMPLATE;

    project.copyRaw(D.sqlFirewallCreateUser, 'drizzle/sql/firewall_create_user.sql');
    project.copyRaw(D.applySqlScript, 'scripts/apply-sql.ts');
    project.copyRaw(D.firewallCreateUser, 'src/server/db/firewall/create-user.ts');
    project.copyRaw(
      AE.recordUserCreatedEvent,
      'src/server/auth/record-user-created-event.ts',
    );

    project.copyRaw(R.index, 'src/repositories/index.ts');
    project.copyRaw(R.user, 'src/repositories/user-repository.ts');
    project.copyRaw(R.event, 'src/repositories/event.repository.ts');
  },
};
