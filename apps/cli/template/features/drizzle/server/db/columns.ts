import { createId } from '@paralleldrive/cuid2';
import { varchar } from 'drizzle-orm/pg-core';

export function cuid() {
  return createId();
}

export const cuidPk = () =>
  varchar('id', { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId());

export const cuidFk = (name: string) => varchar(name, { length: 24 });
