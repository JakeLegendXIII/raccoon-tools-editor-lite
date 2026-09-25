import { describe, expect, it } from 'vitest';

import { initialPassiveState } from './passives.state';

describe('initialPassiveState', () => {
  it('starts with no passives', () => {
    expect(initialPassiveState).toEqual({ passives: [] });
  });
});