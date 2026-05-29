/**
 * Recursively turns camelCase keys into snake_case (objects + arrays).
 * Behaviour matches the tiny `snakeize` npm package (nathan7/snakeize).
 */

const CAPS_SEGMENT = /([A-Z]+)/g;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | RegExp
  | JsonValue[]
  | { [key: string]: JsonValue };

function isDate(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]';
}

function isRegex(value: unknown): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

function toSnakeCase(key: string): string {
  if (key.length === 0) {
    return key;
  }

  const head = key[0];
  if (head === undefined) {
    return key;
  }

  return (
    head.toLowerCase() +
    key.slice(1).replace(CAPS_SEGMENT, (_m, caps: string) => `_${caps.toLowerCase()}`)
  );
}

export function snakeize<T = JsonValue>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (isDate(obj) || isRegex(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeize(item)) as T;
  }

  const source = obj as Record<string, unknown>;
  const keys = Object.keys(source);
  const out: Record<string, unknown> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    out[toSnakeCase(key)] = snakeize(source[key]);
  }

  return out as T;
}

export default snakeize;
