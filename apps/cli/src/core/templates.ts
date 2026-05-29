/**
 * Single map of every template file the CLI copies.
 * To add a feature: drop files under template/features/<name>/ and register a path here.
 */
export const TEMPLATE = {
  base: 'base',

  ui: {
    layouts: {
      base: 'features/ui/layouts/base.tsx',
      tailwind: 'features/ui/layouts/with-tw.tsx',
    },
    pages: {
      base: 'features/ui/pages/base.tsx',
      tailwind: 'features/ui/pages/with-tw.tsx',
      auth: 'features/ui/pages/with-better-auth.tsx',
      authTailwind: 'features/ui/pages/with-better-auth-tw.tsx',
    },
    pageCssModule: 'features/ui/page.module.css',
    authCssModule: 'features/ui/index.module.css',
  },

  auth: {
    route: 'features/auth/api/auth/[...all]/route.ts',
    config: 'features/auth/server/config.ts',
    defaultUserFeatures: 'features/auth/server/default-user-features.ts',
    index: 'features/auth/server/index.ts',
    client: 'features/auth/server/client.ts',
    server: 'features/auth/server/server.ts',
    password: 'features/auth/models/password.ts',
    plugins: ['features/auth/server/plugins/sync-bearer-token.ts'],
  },

  drizzle: {
    config: 'features/drizzle/drizzle.config.ts',
    clientPostgres: 'features/drizzle/server/db/index.postgres.ts',
    clientNeon: 'features/drizzle/server/db/index.neon.ts',
    columns: 'features/drizzle/server/db/columns.ts',
    schemaAuth: 'features/drizzle/server/db/schema/auth.ts',
    schemaEvents: 'features/drizzle/server/db/schema/events.ts',
    schemaIndexAuth: 'features/drizzle/server/db/schema/index-auth.ts',
    schemaIndexAuthEvents: 'features/drizzle/server/db/schema/index-auth-events.ts',
    schemaPosts: 'features/drizzle/server/db/schema/posts.ts',
    schemaIndexBase: 'features/drizzle/server/db/schema/index-base.ts',
    firewallCreateUser: 'features/drizzle/server/db/firewall/create-user.ts',
    sqlFirewallCreateUser: 'features/drizzle/sql/firewall_create_user.sql',
    applySqlScript: 'features/drizzle/scripts/apply-sql.ts',
    startDatabase: 'features/drizzle/start-database.sh',
  },

  repositories: {
    index: 'features/repositories/index.ts',
    user: 'features/repositories/user-repository.ts',
    event: 'features/repositories/event.repository.ts',
  },

  tailwind: {
    postcss: 'features/tailwind/postcss.config.mjs',
    globals: 'features/tailwind/globals.css',
  },

  eslint: {
    base: 'features/eslint/eslint.config.mjs',
    drizzle: 'features/eslint/eslint.drizzle.config.mjs',
    prettier: 'features/eslint/.prettierrc',
    prettierTailwind: 'features/eslint/.tailwind.prettierrc',
    prettierIgnore: 'features/eslint/.prettierignore',
    pnpmRc: 'features/eslint/.npmrc',
  },

  server: {
    merge: 'features/server/lib/helpers/merge.ts',
    noop: 'features/server/lib/helpers/noop.ts',
    webserver: 'features/server/config/webserver.ts',
    errors: 'features/server/errors/index.ts',
    loggerAxiom: 'features/server/logger/axiom-transport.ts',
    loggerConfig: 'features/server/logger/config.ts',
    loggerIndex: 'features/server/logger/index.ts',
    loggerRedact: 'features/server/logger/redact.ts',
    ip: 'features/server/ip/index.ts',
  },

  env: {
    authDb: 'features/env/with-better-auth-db.js',
    db: 'features/env/with-db.js',
    auth: 'features/env/with-better-auth.js',
  },
} as const;
