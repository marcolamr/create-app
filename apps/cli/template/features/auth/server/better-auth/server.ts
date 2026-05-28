import { headers } from 'next/headers';
import { cache } from 'react';

import { auth } from '.';

export const getSession = cache(
  async () => await auth.api.getSession({ headers: await headers() }),
);
