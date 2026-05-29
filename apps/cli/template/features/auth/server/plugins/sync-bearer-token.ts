import { createAuthMiddleware } from 'better-auth/api';
import type { BetterAuthPlugin } from 'better-auth/types';

const SESSION_PATHS = new Set(['/sign-in/email', '/sign-up/email']);

/**
 * O body do sign-in retorna `session.token` (valor do banco).
 * O plugin Bearer expõe o cookie assinado em `set-auth-token` — é esse valor
 * que funciona em `Authorization: Bearer`. Este plugin alinha o campo `token` do JSON.
 */
export function syncBearerTokenPlugin(): BetterAuthPlugin {
  return {
    id: 'sync-bearer-token',
    hooks: {
      after: [
        {
          matcher: (ctx) => Boolean(ctx.path && SESSION_PATHS.has(ctx.path)),
          handler: createAuthMiddleware(async (ctx) => {
            const bearerToken = ctx.context.responseHeaders?.get('set-auth-token');
            const returned = ctx.context.returned;

            if (
              !bearerToken ||
              !returned ||
              typeof returned !== 'object' ||
              !('token' in returned)
            ) {
              return;
            }

            ctx.context.returned = {
              ...returned,
              token: bearerToken,
            };
          }),
        },
      ],
    },
  };
}
