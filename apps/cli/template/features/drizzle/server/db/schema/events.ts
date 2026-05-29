import { index, inet, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { cuidFk, cuidPk } from '../columns';
import { users } from './auth';

export const events = pgTable(
  'events',
  {
    id: cuidPk(),
    type: text('type').notNull(),
    originatorUserId: cuidFk('originator_user_id').references(() => users.id),
    originatorIp: inet('originator_ip'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('events_originator_ip_type_created_at_idx').on(
      table.originatorIp,
      table.type,
      table.createdAt,
    ),
  ],
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
