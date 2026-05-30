import { Level } from '../models/level.model';

export interface LevelState {
  loadedLevels: Level[];
  selectedLevelIndex: number;
}

const createDefaultLevel = (): Level => {
  const level = new Level();
  level.ID = 1;
  level.GridWidth = 8;
  level.GridHeight = 8;
  level.CellSize = 64;
  level.LevelDescription = 'Default Level';
  level.NumberOfTurns = 0;
  return level;
};

export const initialLevelState: LevelState = {
  loadedLevels: [createDefaultLevel()],
  selectedLevelIndex: 0
};
