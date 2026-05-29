import { and, asc, eq, gte, sql } from 'drizzle-orm';

import { DB } from '@/server/db';
import { Event, events, NewEvent } from '@/server/db/schema/events';

export type CreateUserEventMetadata = {
  id: string;
};

export type FirewallBlockUsersMetadata = {
  from_rule: string;
  users: string[];
};

const CREATE_USER_EVENT = 'create:user';
const FIREWALL_BLOCK_USERS_EVENT = 'firewall:block_users';

export class EventRepository {
  constructor(private readonly deps: { db: DB }) {}

  async createUserCreatedEvent(input: {
    userId: string;
    clientIp: string | null;
  }): Promise<Event> {
    return this.create({
      type: CREATE_USER_EVENT,
      originatorUserId: input.userId,
      originatorIp: input.clientIp,
      metadata: { id: input.userId } satisfies CreateUserEventMetadata,
    });
  }

  async create(data: NewEvent): Promise<Event> {
    const [row] = await this.deps.db.insert(events).values(data).returning();

    if (!row) {
      throw new Error('EventRepository.create: insert returned no row');
    }

    return row;
  }

  async findRecentCreateUserByIp(clientIp: string): Promise<Event[]> {
    return this.deps.db
      .select()
      .from(events)
      .where(
        and(
          eq(events.type, CREATE_USER_EVENT),
          eq(events.originatorIp, clientIp),
          gte(events.createdAt, sql`NOW() - INTERVAL '5 seconds'`),
        ),
      )
      .orderBy(asc(events.createdAt));
  }

  extractUserIdsFromCreateUserEvents(eventRows: Event[]): string[] {
    return eventRows
      .map((event) => {
        const metadata = event.metadata as CreateUserEventMetadata | null;
        return metadata?.id;
      })
      .filter((id): id is string => Boolean(id));
  }

  async createFirewallBlockUsersEvent(input: {
    clientIp: string;
    userIds: string[];
    fromRule?: string;
  }): Promise<Event> {
    return this.create({
      type: FIREWALL_BLOCK_USERS_EVENT,
      originatorUserId: null,
      originatorIp: input.clientIp,
      metadata: {
        from_rule: input.fromRule ?? CREATE_USER_EVENT,
        users: input.userIds,
      } satisfies FirewallBlockUsersMetadata,
    });
  }
}
