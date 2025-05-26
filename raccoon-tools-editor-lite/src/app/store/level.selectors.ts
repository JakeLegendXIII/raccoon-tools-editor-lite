import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LevelState } from './level.state';

export const selectLevelState = createFeatureSelector<LevelState>('level');

export const selectCurrentLevel = createSelector(
  selectLevelState,
  (state) => state.currentLevel
);

export const selectPlayers = createSelector(
  selectCurrentLevel,
  (level) => level?.Players || []
);

export const selectEnemies = createSelector(
  selectCurrentLevel,
  (level) => level?.Enemies || []
);

export const selectObstacles = createSelector(
  selectCurrentLevel,
  (level) => level?.Obstacles || []
);
