import type { LoggerOptions } from 'pino';

import { getLogger } from './config';
import { mergeRedactPaths } from './redact';

const defaultLoggerOptions: LoggerOptions = {
  nestedKey: 'payload',
  redact: {
    paths: mergeRedactPaths([
      'password',
      'email',
      'context.user.password',
      'context.user.email',
      'context.user.description',
      'context.session.token',
    ]),
    remove: true,
  },
};

export default getLogger(defaultLoggerOptions);
