import { sql } from 'drizzle-orm';

import { eventRepository, userRepository } from '@/repositories';
import {
  getDefaultNewUserFeatures,
  hasDefaultNewUserFeatures,
} from '@/server/auth/default-user-features';
import { db } from '@/server/db';
import { TooManyRequestsError } from '@/server/errors';

export async function assertCreateUserAllowed(clientIp: string): Promise<void> {
  const result = await db.execute(
    sql`SELECT firewall_create_user(${clientIp}::inet) AS allowed`,
  );

  if (readFirewallAllowed(result)) {
    return;
  }

  await blockRecentUsersFromIp(clientIp);

  throw new TooManyRequestsError({
    message:
      'Identificamos a criação de muitos usuários em um curto período, então usuários criados recentemente podem ter sido desativados.',
    action:
      'Tente novamente mais tarde ou contate o suporte caso acredite que isso seja um erro.',
    errorLocationCode: 'INFRA:DB:FIREWALL:CREATE_USER:TOO_MANY_REQUESTS',
  });
}

export async function assignDefaultFeaturesToNewUser(userId: string): Promise<void> {
  const features = await userRepository.findFeatures(userId);

  if (!features || hasDefaultNewUserFeatures(features)) {
    return;
  }

  await userRepository.updateFeatures(userId, getDefaultNewUserFeatures());
}

function readFirewallAllowed(result: unknown): boolean {
  if (!result || typeof result !== 'object') {
    return true;
  }

  const rows =
    'rows' in result && Array.isArray((result as { rows: unknown }).rows)
      ? (result as { rows: Array<{ allowed?: boolean | string }> }).rows
      : Array.isArray(result)
        ? (result as Array<{ allowed?: boolean | string }>)
        : [];

  const allowed = rows[0]?.allowed;

  if (allowed === false || allowed === 'f' || allowed === 'false') {
    return false;
  }

  return true;
}

async function blockRecentUsersFromIp(clientIp: string): Promise<void> {
  const recentEvents = await eventRepository.findRecentCreateUserByIp(clientIp);
  const userIds = eventRepository.extractUserIdsFromCreateUserEvents(recentEvents);

  if (userIds.length === 0) {
    return;
  }

  for (let index = 1; index < userIds.length; index++) {
    await userRepository.clearFeatures(userIds[index]!);
  }

  await eventRepository.createFirewallBlockUsersEvent({
    clientIp,
    userIds,
  });

  // TODO: send account deactivated email
  // for (const userId of userIds) {
  //   const user = await userRepository.findById(userId);
  //   await sendAccountDeactivatedEmail(user, blockEvent.id);
  // }
}
