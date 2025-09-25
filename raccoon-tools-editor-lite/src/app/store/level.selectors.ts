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

export const selectLevelGridWidth = createSelector(
  selectCurrentLevel,
  (level) => level?.GridWidth || 0
);

export const selectLevelGridHeight = createSelector(
  selectCurrentLevel,
  (level) => level?.GridHeight || 0
);

export const selectLevelCellSize = createSelector(
  selectCurrentLevel,
  (level) => level?.CellSize || 0
);

export const selectLevelType = createSelector(
  selectCurrentLevel,
  (level) => level?.LevelType || 0
);

export const selectLevelDescription = createSelector(
  selectCurrentLevel,
  (level) => level?.LevelDescription || ''
);

export const selectWinPosition = createSelector(
  selectCurrentLevel,
  (level) => level?.WinPosition || { X: 0, Y: 0 }
);

export const selectNumberOfTurns = createSelector(
  selectCurrentLevel,
  (level) => level?.NumberOfTurns || 0
);

export const selectLevelID = createSelector(
  selectCurrentLevel,
  (level) => level?.ID || 0
);

export const selectStartPositions = createSelector(
  selectCurrentLevel,
  (level) => level?.StartPositionsList || []
);