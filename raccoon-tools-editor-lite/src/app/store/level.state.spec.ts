import { describe, expect, it } from 'vitest';

import { Level } from '../models/level.model';
import { initialLevelState } from './level.state';

describe('initialLevelState', () => {
  it('starts with one selected, editable default level', () => {
    expect(initialLevelState.selectedLevelIndex).toBe(0);
    expect(initialLevelState.loadedLevels).toHaveLength(1);

    const level = initialLevelState.loadedLevels[0];
    expect(level).toBeInstanceOf(Level);
    expect(level).toMatchObject({
      ID: 1,
      GridWidth: 8,
      GridHeight: 8,
      CellSize: 64,
      LevelDescription: 'Default Level',
      NumberOfTurns: 0,
      Players: [],
      Enemies: [],
      Obstacles: [],
      StartPositionsList: []
    });
  });
});