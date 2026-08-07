import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PassiveState } from './passives.state';

export const selectPassiveState = createFeatureSelector<PassiveState>('passive');

export const selectPassives = createSelector(
  selectPassiveState,
  (state) => state.passives
);