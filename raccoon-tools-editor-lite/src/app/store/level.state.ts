import { Level } from '../models/level.model';

export interface LevelState {
  currentLevel: Level | null;
}

export const initialLevelState: LevelState = {
  currentLevel: new Level()
};
