import { eq } from 'drizzle-orm';

import { DB } from '@/server/db';
import { User, users } from '@/server/db/schema/auth';

export class UserRepository {
  constructor(private readonly deps: { db: DB }) {}

  async findById(id: string): Promise<User | null> {
    const [row] = await this.deps.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return row ?? null;
  }

  async findFeatures(userId: string): Promise<string[] | null> {
    const [row] = await this.deps.db
      .select({ features: users.features })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return row?.features ?? null;
  }

  async updateFeatures(userId: string, features: string[]): Promise<User | null> {
    const [row] = await this.deps.db
      .update(users)
      .set({ features, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return row ?? null;
  }

  async updateProfile(
    userId: string,
    data: { notifications?: boolean; description?: string },
  ): Promise<User | null> {
    const patch: Partial<Pick<User, 'notifications' | 'description'>> = {};

    if (data.notifications !== undefined) {
      patch.notifications = data.notifications;
    }

    if (data.description !== undefined) {
      patch.description = data.description;
    }

    if (Object.keys(patch).length === 0) {
      return this.findById(userId);
    }

    const [row] = await this.deps.db
      .update(users)
      .set(patch)
      .where(eq(users.id, userId))
      .returning();

    return row ?? null;
  }

  /** Clears feature flags (de facto deactivation for firewall enforcement). */
  async clearFeatures(userId: string): Promise<User | null> {
    const [row] = await this.deps.db
      .update(users)
      .set({ features: [] })
      .where(eq(users.id, userId))
      .returning();

    return row ?? null;
  }
}
