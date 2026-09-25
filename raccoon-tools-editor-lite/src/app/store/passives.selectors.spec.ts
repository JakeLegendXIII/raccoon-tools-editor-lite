import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { Passive } from '../models/passive.model';
import * as PassivesSelectors from './passives.selectors';
import { PassiveState } from './passives.state';

describe('passive selectors', () => {
  it('reads the passive feature state and its passives list', () => {
    const state: PassiveState = {
      passives: [Object.assign(new Passive(), { ID: 1 }), Object.assign(new Passive(), { ID: 2 })]
    };
    const root = { passive: state };

    expect(PassivesSelectors.selectPassiveState(root)).toBe(state);
    expect(PassivesSelectors.selectPassives(root)).toBe(state.passives);
  });

  it('returns the empty list from an empty feature state', () => {
    const state: PassiveState = { passives: [] };

    expect(PassivesSelectors.selectPassives({ passive: state })).toBe(state.passives);
  });
});