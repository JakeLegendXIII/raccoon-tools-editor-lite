import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { Passive } from '../models/passive.model';
import * as PassivesActions from './passives.actions';
import { passivesReducer } from './passives.reducer';
import { initialPassiveState, PassiveState } from './passives.state';

describe('passivesReducer', () => {
  const createPassive = (id: number, name: string): Passive =>
    Object.assign(new Passive(), { ID: id, Name: name });

  it('returns the initial state for an unknown action', () => {
    expect(passivesReducer(undefined, { type: 'unknown' })).toBe(initialPassiveState);
  });

  it('replaces the loaded passives', () => {
    const previous = createPassive(1, 'Old');
    const state: PassiveState = { passives: [previous] };
    const passives = [createPassive(2, 'New')];

    const result = passivesReducer(state, PassivesActions.loadPassives({ passives }));

    expect(result.passives).toBe(passives);
    expect(state.passives).toEqual([previous]);
  });

  it('appends a passive without mutating the previous list', () => {
    const first = createPassive(1, 'First');
    const state: PassiveState = { passives: [first] };
    const second = createPassive(2, 'Second');

    const result = passivesReducer(state, PassivesActions.addPassive({ passive: second }));

    expect(result.passives).toEqual([first, second]);
    expect(result.passives).not.toBe(state.passives);
    expect(state.passives).toEqual([first]);
  });

  it('updates the passive with the matching ID and preserves others', () => {
    const first = createPassive(1, 'Before');
    const other = createPassive(2, 'Other');
    const state: PassiveState = { passives: [first, other] };
    const updated = Object.assign(createPassive(1, 'After'), { BonusAttack: true, Amount: 3 });

    const result = passivesReducer(state, PassivesActions.updatePassive({ passive: updated }));

    expect(result.passives).toEqual([updated, other]);
    expect(result.passives[1]).toBe(other);
    expect(state.passives[0]).toBe(first);
  });

  it('leaves all passives unchanged when an update ID is absent', () => {
    const first = createPassive(1, 'First');
    const state: PassiveState = { passives: [first] };

    const result = passivesReducer(state, PassivesActions.updatePassive({ passive: createPassive(3, 'Unknown') }));

    expect(result.passives).toEqual([first]);
    expect(result.passives[0]).toBe(first);
  });

  it('deletes only passives matching the ID', () => {
    const first = createPassive(1, 'First');
    const other = createPassive(2, 'Other');
    const state: PassiveState = { passives: [first, other] };

    const result = passivesReducer(state, PassivesActions.deletePassive({ passiveId: 1 }));
    const missing = passivesReducer(state, PassivesActions.deletePassive({ passiveId: 3 }));

    expect(result.passives).toEqual([other]);
    expect(missing.passives).toEqual([first, other]);
    expect(state.passives).toEqual([first, other]);
  });
});