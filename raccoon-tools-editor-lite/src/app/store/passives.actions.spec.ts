import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { Passive } from '../models/passive.model';
import * as PassivesActions from './passives.actions';

describe('passive actions', () => {
  const passive = Object.assign(new Passive(), { ID: 2, Name: 'Shield' });

  it.each([
    [PassivesActions.loadPassives({ passives: [passive] }), '[Passives] Load Passives', { passives: [passive] }],
    [PassivesActions.addPassive({ passive }), '[Passives] Add Passive', { passive }],
    [PassivesActions.updatePassive({ passive }), '[Passives] Update Passive', { passive }],
    [PassivesActions.deletePassive({ passiveId: 2 }), '[Passives] Delete Passive', { passiveId: 2 }]
  ])('creates %s with the expected type and payload', (action, type, payload) => {
    expect(action).toEqual({ type, ...payload });
  });
});