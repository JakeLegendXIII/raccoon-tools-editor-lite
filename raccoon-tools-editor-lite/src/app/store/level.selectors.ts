import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LevelState } from './level.state';

export const selectLevelState = createFeatureSelector<LevelState>('level');

export const selectCurrentLevel = createSelector(
  selectLevelState,
  (state) => state.currentLevel
);

export const selectPlayers = createSelector(
  selectCurrentLevel,
  (level) => level?.players || []
);

export const selectEnemies = createSelector(
  selectCurrentLevel,
  (level) => level?.enemies || []
);

export const selectObstacles = createSelector(
  selectCurrentLevel,
  (level) => level?.obstacles || []
);
