import pino, { type LevelWithSilent, type Logger, type LoggerOptions } from 'pino';

import { deepMerge } from '@/lib/helpers/merge';
import { noop } from '@/lib/helpers/noop';

import { axiomTransport } from './axiom-transport';

const PRODUCTION_LIKE_ENVS = new Set(['preview', 'production']);

const LOG_LEVEL_PRIORITIES = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  silent: 70,
} as const;

type LogLevelName = keyof typeof LOG_LEVEL_PRIORITIES;

const consoleRef = globalThis.console;

const CONSOLE_WRITE: Record<LogLevelName, (...args: unknown[]) => void> = {
  trace: consoleRef.trace.bind(consoleRef),
  debug: consoleRef.debug.bind(consoleRef),
  info: consoleRef.log.bind(consoleRef),
  warn: consoleRef.warn.bind(consoleRef),
  error: consoleRef.error.bind(consoleRef),
  fatal: consoleRef.error.bind(consoleRef),
  silent: noop,
};

export interface ConsoleLogger {
  level: LevelWithSilent;
  trace: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  fatal: (...args: unknown[]) => void;
  flush: () => void;
  bindings: () => Record<string, unknown>;
  setBindings: (nextBindings?: Record<string, unknown>) => void;
  child: (childBindings?: Record<string, unknown>) => ConsoleLogger;
  isLevelEnabled: (targetLevel: string) => boolean;
}

export type AppLogger = Logger | ConsoleLogger;

export function getLogger(options: LoggerOptions = {}): AppLogger {
  const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
  const logLevel = process.env.LOG_LEVEL;
  const level = (logLevel ?? options.level ?? 'info') as LevelWithSilent;

  if (
    (environment !== undefined && PRODUCTION_LIKE_ENVS.has(environment)) ||
    process.env.AXIOM_DATASET
  ) {
    return pino(
      {
        ...options,
        base: {
          environment,
          ...options.base,
        },
        level,
      },
      axiomTransport(),
    );
  }

  return createConsoleLogger({
    effectiveMinLocalLogLevel: logLevel ?? (environment === 'test' ? 'silent' : 'warn'),
    level,
  });
}

function getConsoleWrite(levelName: string): (...args: unknown[]) => void {
  if (levelName in CONSOLE_WRITE) {
    return CONSOLE_WRITE[levelName as LogLevelName];
  }

  return consoleRef.log.bind(consoleRef);
}

interface CreateConsoleLoggerParams {
  bindings?: Record<string, unknown>;
  effectiveMinLocalLogLevel?: LevelWithSilent | string;
  level?: LevelWithSilent;
}

function createConsoleLogger({
  bindings = {},
  effectiveMinLocalLogLevel = 'warn',
  level: initialLevel = 'info',
}: CreateConsoleLoggerParams = {}): ConsoleLogger {
  const currentBindings: Record<string, unknown> = { ...bindings };
  let level: LevelWithSilent = initialLevel;

  const log = (targetLevel: string, ...args: unknown[]): void => {
    if (!isLevelEnabled(targetLevel, effectiveMinLocalLogLevel)) {
      return;
    }

    const method = getConsoleWrite(targetLevel);
    const hasBindings = Object.keys(currentBindings).length > 0;

    if (args.length === 0) {
      if (hasBindings) {
        method({ ...currentBindings });
      }
      return;
    }

    const [firstArg, ...restArgs] = args;

    if (typeof firstArg === 'string') {
      if (hasBindings) {
        method(firstArg, { ...currentBindings }, ...restArgs);
        return;
      }

      method(firstArg, ...restArgs);
      return;
    }

    if (firstArg !== null && typeof firstArg === 'object') {
      const payload = deepMerge(currentBindings, firstArg as Record<string, unknown>);

      if (typeof restArgs[0] === 'string') {
        const [msg, ...remaining] = restArgs as [string, ...unknown[]];
        method(msg, payload, ...remaining);
        return;
      }

      method(payload, ...restArgs);
      return;
    }

    method(firstArg, ...restArgs);
  };

  return {
    get level() {
      return level;
    },
    set level(nextLevel) {
      if (nextLevel in LOG_LEVEL_PRIORITIES) {
        level = nextLevel as LevelWithSilent;
      }
    },
    trace(...args: unknown[]) {
      log('trace', ...args);
    },
    debug(...args: unknown[]) {
      log('debug', ...args);
    },
    info(...args: unknown[]) {
      log('info', ...args);
    },
    warn(...args: unknown[]) {
      log('warn', ...args);
    },
    error(...args: unknown[]) {
      log('error', ...args);
    },
    fatal(...args: unknown[]) {
      log('fatal', ...args);
    },
    flush: noop,
    bindings() {
      return { ...currentBindings };
    },
    setBindings(nextBindings: Record<string, unknown> = {}) {
      Object.assign(currentBindings, deepMerge(currentBindings, nextBindings));
    },
    child(childBindings: Record<string, unknown> = {}) {
      return createConsoleLogger({
        effectiveMinLocalLogLevel,
        level,
        bindings: deepMerge(currentBindings, childBindings),
      });
    },
    isLevelEnabled(targetLevel: string) {
      return isLevelEnabled(targetLevel, level);
    },
  };
}

function isLevelEnabled(targetLevel: string, currentLevel: string): boolean {
  const targetPriority = LOG_LEVEL_PRIORITIES[targetLevel as LogLevelName];
  const currentPriority =
    LOG_LEVEL_PRIORITIES[currentLevel as LogLevelName] ?? LOG_LEVEL_PRIORITIES.warn;

  if (targetPriority === undefined) {
    return false;
  }

  return targetPriority >= currentPriority;
}
