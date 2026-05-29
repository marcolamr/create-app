import { describe, expect, it } from 'vitest';

import { renderTitle } from './title.js';

describe('renderTitle', () => {
  it('returns a non-empty gradient string', () => {
    const title = renderTitle();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toMatch(/@|madda|__/i);
  });
});
