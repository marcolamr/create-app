import { db } from '@/server/db';

import { EventRepository } from './event.repository';
import { UserRepository } from './user-repository';

export const eventRepository: EventRepository = createEventRepository();

export function createEventRepository(): EventRepository {
  return new EventRepository({ db });
}

export const userRepository: UserRepository = createUserRepository();

export function createUserRepository(): UserRepository {
  return new UserRepository({ db });
}
