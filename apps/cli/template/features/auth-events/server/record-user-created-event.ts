import type { NextRequest } from 'next/server';

import { getSessionFromCtx } from 'better-auth/api';

import { eventRepository } from '@/repositories';
import { assignDefaultFeaturesToNewUser } from '@/server/db/firewall/create-user';

type AuthHookContext = Parameters<typeof getSessionFromCtx>[0];

function isNewUserPayload(
  value: unknown,
): value is { user: { id: string } } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = (value as { user?: { id?: unknown } }).user;
  return Boolean(user && typeof user.id === 'string');
}

export async function recordUserCreatedEventFromAuthContext(
  request: NextRequest,
  ctx: AuthHookContext,
): Promise<void> {
  if (ctx.path !== '/sign-up/email' || ctx.method?.toUpperCase() !== 'POST') {
    return;
  }

  const returned = ctx.context.returned;
  if (!isNewUserPayload(returned)) {
    return;
  }

  const userId = returned.user.id;
  const clientIp = request.context?.clientIp ?? null;

  await eventRepository.createUserCreatedEvent({ userId, clientIp });
  await assignDefaultFeaturesToNewUser(userId);
}
