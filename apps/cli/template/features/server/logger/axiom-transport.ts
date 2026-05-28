// Inspired by `@axiomhq/pino`, but compatible with `waitUntil` from `@vercel/functions`
import { Axiom } from '@axiomhq/js';
import { waitUntil } from '@vercel/functions';
import type { Transform } from 'node:stream';
import build from 'pino-abstract-transport';

export interface AxiomTransportOptions {
  dataset?: string;
  token?: string;
  url?: string;
  orgId?: string;
}

type AxiomIngestEvent = Record<string, unknown>;

/** Pino numeric levels → label (see pino docs). */
const LEVEL_THRESHOLDS: readonly { max: number; label: string }[] = [
  { max: 10, label: 'trace' },
  { max: 20, label: 'debug' },
  { max: 30, label: 'info' },
  { max: 40, label: 'warn' },
  { max: 50, label: 'error' },
  { max: 60, label: 'fatal' },
] as const;

type PinoAbstractTransport = Transform & build.OnUnknown;

export type AxiomPinoTransport = PinoAbstractTransport & { flush: () => void };

export function axiomTransport(
  options: AxiomTransportOptions = {},
): AxiomPinoTransport | undefined {
  const dataset = options.dataset ?? process.env.AXIOM_DATASET;
  const token = options.token ?? process.env.AXIOM_TOKEN;
  const url = options.url ?? process.env.AXIOM_URL;
  const orgId = options.orgId ?? process.env.AXIOM_ORG_ID;

  if (!process.versions?.node || !dataset || !token) {
    return undefined;
  }

  const ingestDataset: string = dataset;

  let parsedCount = 0;
  let ingestedCount = 0;
  let waitingFlush = false;
  let resolve: (() => void) | undefined;
  let reject: ((err: unknown) => void) | undefined;

  const axiom = new Axiom({
    token,
    url,
    ...(orgId !== undefined && orgId !== '' ? { orgId } : {}),
    onError: (error: Error) => {
      onError(error);
    },
  });

  const stream = build(
    async function (source: PinoAbstractTransport) {
      for await (const chunk of source) {
        if (chunk === null || typeof chunk !== 'object') {
          continue;
        }

        const obj = chunk as Record<string, unknown> & {
          time?: unknown;
          level?: unknown;
        };
        const { time, level, ...rest } = obj;

        ingestLogs({
          _time: time,
          level: getLogLevel(level),
          ...rest,
        });
      }
    },
    {
      close(err, cb) {
        flushPendingLogs();
        process.nextTick(cb, err);
      },
      parseLine,
    },
  );

  const transport = stream as AxiomPinoTransport;
  transport.flush = flushPendingLogs;

  return transport;

  function onError(err: Error): void {
    rejectPendingPromise(err);
    console.error('Error sending logs to Axiom:\n', err);
  }

  function parseLine(line: string): unknown {
    const value: unknown = JSON.parse(line);
    parsedCount++;
    return value;
  }

  function ingestLogs(event: AxiomIngestEvent): void {
    axiom.ingest(ingestDataset, event);
    ingestedCount++;

    if (waitingFlush) {
      flushPendingLogs();
    }
  }

  function flushPendingLogs(): void {
    if (ingestedCount === 0 || parsedCount > ingestedCount) {
      waitingFlush = true;
      ensurePendingPromise();
      return;
    }

    waitingFlush = false;
    waitUntil(axiom.flush());
    resolvePendingPromise();
  }

  function ensurePendingPromise(): void {
    if (resolve === undefined) {
      waitUntil(
        new Promise<void>((res, rej) => {
          resolve = res;
          reject = rej;
        }),
      );
    }
  }

  function resolvePendingPromise(): void {
    if (resolve !== undefined) {
      resolve();
      resolve = undefined;
      reject = undefined;
    }
  }

  function rejectPendingPromise(err: unknown): void {
    if (reject !== undefined) {
      reject(err);
      resolve = undefined;
      reject = undefined;
    }
  }
}

function getLogLevel(level: unknown): string {
  if (typeof level === 'string') {
    return level;
  }

  if (typeof level !== 'number' || Number.isNaN(level)) {
    return 'info';
  }

  for (const { max, label } of LEVEL_THRESHOLDS) {
    if (level <= max) {
      return label;
    }
  }

  return 'silent';
}
