import { env } from '@/env';

const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

const isServerlessRuntime = Boolean(vercelEnv);
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
const isProduction = vercelEnv === 'production';

const host = isProduction
  ? `https://${env.NEXT_PUBLIC_WEBSERVER_HOST}`
  : isServerlessRuntime
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://${env.NEXT_PUBLIC_WEBSERVER_HOST}:${env.NEXT_PUBLIC_WEBSERVER_PORT}`;

export type WebserverConfig = Readonly<{
  host: string;
  isBuildTime: boolean;
  isProduction: boolean;
  isServerlessRuntime: boolean;
}>;

const config: WebserverConfig = {
  host,
  isBuildTime,
  isProduction,
  isServerlessRuntime,
};

export default Object.freeze(config);
