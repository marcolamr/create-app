/** True when `value` is an array. */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const isEqual = Object.is;

/** True when `value` is a non-null object that is not an array. */
export const isObject = (value: unknown): value is Record<PropertyKey, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === 'undefined';

/** True for plain object literals (not `null`, arrays, or exotic objects). */
export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }
  const proto = Object.getPrototypeOf(obj as object);
  return proto === null || proto === Object.prototype;
}
