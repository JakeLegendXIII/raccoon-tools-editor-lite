import { createReducer, on } from '@ngrx/store';
import * as PassivesActions from './passives.actions';
import { initialPassiveState } from './passives.state';

export const passivesReducer = createReducer(
  initialPassiveState,
  on(PassivesActions.loadPassives, (state, { passives }) => ({
    ...state,
    passives
  })),
  on(PassivesActions.addPassive, (state, { passive }) => ({
    ...state,
    passives: [...state.passives, passive]
  })),
  on(PassivesActions.updatePassive, (state, { passive }) => ({
    ...state,
    passives: state.passives.map(current => current.ID === passive.ID ? passive : current)
  })),
  on(PassivesActions.deletePassive, (state, { passiveId }) => ({
    ...state,
    passives: state.passives.filter(passive => passive.ID !== passiveId)
  }))
);