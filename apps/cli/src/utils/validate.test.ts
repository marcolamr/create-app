import { describe, expect, it } from 'vitest';

import { validateAppName } from './validate.js';

describe('validateAppName', () => {
  it('rejects empty names', () => {
    expect(validateAppName(undefined)).toBe('Name is required');
    expect(validateAppName('   ')).toBe('Name is required');
  });

  it('accepts current directory', () => {
    expect(validateAppName('.')).toBeUndefined();
  });

  it('accepts valid names', () => {
    expect(validateAppName('my-app')).toBeUndefined();
    expect(validateAppName('@scope/my-app')).toBeUndefined();
    expect(validateAppName('my app')).toBeUndefined();
  });

  it('rejects invalid characters', () => {
    expect(validateAppName('my.app')).toBe('Use letters, numbers, @, /, _, - only');
    expect(validateAppName('app!')).toBe('Use letters, numbers, @, /, _, - only');
  });
});
