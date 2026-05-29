import type { NextRequest } from 'next/server';

import { createAuthMiddleware } from 'better-auth/api';
import type { BetterAuthPlugin } from 'better-auth/types';

import { recordUserCreatedEventFromAuthContext } from '@/server/auth/record-user-created-event';
import { assertCreateUserAllowed } from '@/server/db/firewall/create-user';
import {
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
  serializeErrorForClient,
  TooManyRequestsError,
  UnprocessableEntityError,
  ValidationError,
} from '@/server/errors';
import logger from '@/server/logger';
import snakeize from '@/lib/helpers/snakeize';
import authentication from '@/models/authentication';
import controller from '@/models/controller';

function handleAppError(request: NextRequest, error: unknown) {
  if (
    error instanceof ValidationError ||
    error instanceof MethodNotAllowedError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof UnprocessableEntityError ||
    error instanceof TooManyRequestsError
  ) {
    const publicPayload = serializeErrorForClient(error, {
      requestId: request.context?.requestId,
    });
    const privateErrorObject = {
      ...publicPayload,
      context: { ...request.context },
    };
    logger.info(snakeize(privateErrorObject));

    return controller.errorResponse(error.statusCode, snakeize(publicPayload));
  }

  throw error;
}

export function localMiddleware(): BetterAuthPlugin {
  return {
    id: 'local-middleware',
    hooks: {
      before: [
        {
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => {
            const request = ctx.request as NextRequest | undefined;
            if (!request) {
              return;
            }

            controller.injectRequestMetadata(request);

            try {
              await authentication.injectRequestContext(request, {
                authCtx: ctx,
                path: ctx.path,
              });

              if (ctx.path === '/sign-up/email' && ctx.method?.toUpperCase() === 'POST') {
                const clientIp = request.context?.clientIp ?? '127.0.0.1';
                await assertCreateUserAllowed(clientIp);
              }
            } catch (error) {
              return handleAppError(request, error);
            }
          }),
        },
      ],
      after: [
        {
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => {
            const request = ctx.request as NextRequest | undefined;
            if (!request) {
              return;
            }

            try {
              await authentication.syncRequestContextAfterHandler(request, ctx);

              await recordUserCreatedEventFromAuthContext(request, ctx);
            } catch (error) {
              return handleAppError(request, error);
            }

            await controller.logRequest(request);
          }),
        },
      ],
    },
  };
}
