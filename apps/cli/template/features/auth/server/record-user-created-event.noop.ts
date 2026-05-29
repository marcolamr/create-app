import type { NextRequest } from 'next/server';

/** No-op when auth events (firewall / event log) are not enabled. */
export async function recordUserCreatedEventFromAuthContext(
  _request: NextRequest,
  _ctx: unknown,
): Promise<void> {}
