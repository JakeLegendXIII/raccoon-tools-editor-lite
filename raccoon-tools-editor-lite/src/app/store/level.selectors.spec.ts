import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { EnemyData, Level, LevelPoint, ObstacleData, PlayerData } from '../models/level.model';
import * as LevelSelectors from './level.selectors';
import { LevelState } from './level.state';

describe('level selectors', () => {
  const first = new Level();
  const selected = Object.assign(new Level(), {
    ID: 9,
    GridWidth: 12,
    GridHeight: 7,
    CellSize: 32,
    LevelType: 2,
    BiomeType: 1,
    LevelDifficultyType: 2,
    LevelDescription: 'Selected level',
    NumberOfTurns: 15,
    WinPosition: Object.assign(new LevelPoint(), { X: 4, Y: 5 }),
    Players: [new PlayerData()],
    Enemies: [new EnemyData()],
    Obstacles: [new ObstacleData()],
    StartPositionsList: [Object.assign(new LevelPoint(), { X: 2, Y: 3 })]
  });
  const state: LevelState = { loadedLevels: [first, selected], selectedLevelIndex: 1 };

  it('reads the level feature state and selects the current level by index', () => {
    expect(LevelSelectors.selectLevelState({ level: state })).toBe(state);
    expect(LevelSelectors.selectLoadedLevels({ level: state })).toBe(state.loadedLevels);
    expect(LevelSelectors.selectSelectedLevelIndex({ level: state })).toBe(1);
    expect(LevelSelectors.selectCurrentLevel({ level: state })).toBe(selected);
    expect(LevelSelectors.selectCurrentLevel({ level: { ...state, selectedLevelIndex: 3 } })).toBeNull();
  });

  it('exposes entities, dimensions, metadata, and positions from the selected level', () => {
    const root = { level: state };
    expect(LevelSelectors.selectPlayers(root)).toBe(selected.Players);
    expect(LevelSelectors.selectEnemies(root)).toBe(selected.Enemies);
    expect(LevelSelectors.selectObstacles(root)).toBe(selected.Obstacles);
    expect(LevelSelectors.selectLevelGridWidth(root)).toBe(12);
    expect(LevelSelectors.selectLevelGridHeight(root)).toBe(7);
    expect(LevelSelectors.selectLevelCellSize(root)).toBe(32);
    expect(LevelSelectors.selectLevelType(root)).toBe(2);
    expect(LevelSelectors.selectBiomeType(root)).toBe(1);
    expect(LevelSelectors.selectLevelDifficultyType(root)).toBe(2);
    expect(LevelSelectors.selectLevelDescription(root)).toBe('Selected level');
    expect(LevelSelectors.selectWinPosition(root)).toBe(selected.WinPosition);
    expect(LevelSelectors.selectNumberOfTurns(root)).toBe(15);
    expect(LevelSelectors.selectLevelID(root)).toBe(9);
    expect(LevelSelectors.selectStartPositions(root)).toBe(selected.StartPositionsList);
  });

  it('provides empty values when there is no selected level', () => {
    const root = { level: { loadedLevels: [], selectedLevelIndex: 0 } };
    expect(LevelSelectors.selectCurrentLevel(root)).toBeNull();
    expect(LevelSelectors.selectPlayers(root)).toEqual([]);
    expect(LevelSelectors.selectEnemies(root)).toEqual([]);
    expect(LevelSelectors.selectObstacles(root)).toEqual([]);
    expect(LevelSelectors.selectStartPositions(root)).toEqual([]);
    expect(LevelSelectors.selectLevelGridWidth(root)).toBe(0);
    expect(LevelSelectors.selectLevelGridHeight(root)).toBe(0);
    expect(LevelSelectors.selectLevelCellSize(root)).toBe(0);
    expect(LevelSelectors.selectLevelType(root)).toBe(0);
    expect(LevelSelectors.selectBiomeType(root)).toBe(0);
    expect(LevelSelectors.selectLevelDifficultyType(root)).toBe(0);
    expect(LevelSelectors.selectLevelDescription(root)).toBe('');
    expect(LevelSelectors.selectWinPosition(root)).toEqual({ X: 0, Y: 0 });
    expect(LevelSelectors.selectNumberOfTurns(root)).toBe(0);
    expect(LevelSelectors.selectLevelID(root)).toBe(0);
  });
});