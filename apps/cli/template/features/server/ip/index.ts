import { isInSubnet, isIP } from 'is-in-subnet';
import type { NextRequest } from 'next/server';
import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';

import webserver from '@/config/webserver';

/** `Request` (Edge) ou `IncomingMessage` (Node). */
export type IpRequestSource = IncomingMessage | Request;

const CLOUDFLARE_CIDRS = [
  '172.64.0.0/13',
  '162.158.0.0/15',
  '108.162.192.0/18',
  '198.41.128.0/17',
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '141.101.64.0/18',
  '190.93.240.0/20',
  '188.114.96.0/20',
  '197.234.240.0/22',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '131.0.72.0/22',
  '2400:cb00::/32',
  '2606:4700::/32',
  '2803:f800::/32',
  '2405:b500::/32',
  '2405:8100::/32',
  '2a06:98c0::/29',
  '2c0f:f248::/32',
] as const;

function incomingHttpHeadersToHeaders(incoming: IncomingHttpHeaders): Headers {
  const out = new Headers();

  for (const key of Object.keys(incoming)) {
    const value = incoming[key];
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        out.append(key, item);
      }
    } else {
      out.set(key, value);
    }
  }

  return out;
}

function lastForwardedIp(chain: string | undefined): string | undefined {
  if (!chain) return undefined;
  return chain
    .split(',')
    .map((part) => part.trim())
    .at(-1);
}

function isCloudflareEdgeIp(ip: string | undefined): boolean {
  if (!ip) return false;

  try {
    return isIP(ip) !== 0 && isInSubnet(ip, [...CLOUDFLARE_CIDRS]);
  } catch {
    return false;
  }
}

function headersForRequest(request: IpRequestSource): Headers {
  return request instanceof Request
    ? request.headers
    : incomingHttpHeadersToHeaders(request.headers);
}

export function isRequestFromCloudflare(request: IpRequestSource): boolean {
  const proxyIp = lastForwardedIp(
    headersForRequest(request).get('x-vercel-proxied-for') ?? undefined,
  );
  return isCloudflareEdgeIp(proxyIp);
}

/**
 * Deriva o IP do cliente a partir de headers (Route Handlers, middleware, Better Auth).
 */
export function extractFromHeaders(
  headers: Headers,
  fallbackRemote?: string | null,
): string {
  const vercelProxiedChain = headers.get('x-vercel-proxied-for');
  const proxyIp = lastForwardedIp(vercelProxiedChain ?? undefined);

  if (isCloudflareEdgeIp(proxyIp)) {
    return headers.get('cf-connecting-ip')?.trim() || '0.0.0.0';
  }

  let realIp = webserver.isServerlessRuntime
    ? lastForwardedIp(vercelProxiedChain ?? undefined)
    : lastForwardedIp(headers.get('x-forwarded-for') ?? undefined);

  if (!realIp) {
    realIp = fallbackRemote?.trim() || '127.0.0.1';
  }

  if (!webserver.isServerlessRuntime) {
    if (realIp === '::1') realIp = '127.0.0.1';
    if (realIp.startsWith('::ffff:')) realIp = realIp.slice(7);
  }

  return realIp;
}

export function extractFromRequest(request: IpRequestSource): string {
  const headers = headersForRequest(request);
  const fallback = request instanceof Request ? undefined : request.socket?.remoteAddress;
  return extractFromHeaders(headers, fallback);
}

export function extractFromNextRequest(request: NextRequest): string {
  return extractFromHeaders(request.headers);
}

export function extractFromIncomingHeaders(
  headers: IncomingHttpHeaders,
  fallbackRemote?: string | null,
): string {
  return extractFromHeaders(incomingHttpHeadersToHeaders(headers), fallbackRemote);
}
