import { createAction, props } from '@ngrx/store';
import { Passive } from '../models/passive.model';

export const loadPassives = createAction(
  '[Passives] Load Passives',
  props<{ passives: Passive[] }>()
);

export const addPassive = createAction(
  '[Passives] Add Passive',
  props<{ passive: Passive }>()
);

export const updatePassive = createAction(
  '[Passives] Update Passive',
  props<{ passive: Passive }>()
);

export const deletePassive = createAction(
  '[Passives] Delete Passive',
  props<{ passiveId: number }>()
);