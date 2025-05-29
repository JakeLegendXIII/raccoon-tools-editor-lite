import { Level } from '../models/level.model';

export interface LevelState {
  currentLevel: Level | null;
}

const createDefaultLevel = (): Level => {
  const level = new Level();
  level.ID = 1;
  level.GridWidth = 10;
  level.GridHeight = 8;
  level.CellSize = 50;
  level.LevelDescription = 'Default Level';
  level.NumberOfTurns = 10;
  return level;
};

export const initialLevelState: LevelState = {
  currentLevel: createDefaultLevel()
};
