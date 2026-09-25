import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { EnemyData, Level, LevelPoint, ObstacleData, PlayerData } from '../models/level.model';
import * as LevelActions from './level.actions';
import { levelReducer } from './level.reducer';
import { initialLevelState, LevelState } from './level.state';

describe('levelReducer', () => {
  const createState = (): LevelState => ({
    loadedLevels: [new Level(), new Level()],
    selectedLevelIndex: 1
  });

  it('returns the initial state for an unknown action', () => {
    expect(levelReducer(undefined, { type: 'unknown' })).toBe(initialLevelState);
  });

  it('adds, updates, and deletes players only in the selected level', () => {
    const state = createState();
    const player = Object.assign(new PlayerData(), { ID: 1, Health: 10 });
    const added = levelReducer(state, LevelActions.addPlayer({ player }));
    const updatedPlayer = Object.assign(new PlayerData(), { ID: 1, Health: 20 });
    const updated = levelReducer(added, LevelActions.updatePlayer({ player: updatedPlayer }));
    const deleted = levelReducer(updated, LevelActions.deletePlayer({ playerId: 1 }));

    expect(added.loadedLevels[1].Players).toEqual([player]);
    expect(updated.loadedLevels[1].Players).toEqual([updatedPlayer]);
    expect(deleted.loadedLevels[1].Players).toEqual([]);
    expect(state.loadedLevels[1].Players).toEqual([]);
    expect(added.loadedLevels[0]).toBe(state.loadedLevels[0]);
  });

  it('adds, updates, and deletes enemies by ID', () => {
    const enemy = Object.assign(new EnemyData(), { ID: 2, Health: 10 });
    const updatedEnemy = Object.assign(new EnemyData(), { ID: 2, Health: 30 });
    const added = levelReducer(createState(), LevelActions.addEnemy({ enemy }));
    const updated = levelReducer(added, LevelActions.updateEnemy({ enemy: updatedEnemy }));
    const deleted = levelReducer(updated, LevelActions.deleteEnemy({ enemyId: 2 }));

    expect(added.loadedLevels[1].Enemies).toEqual([enemy]);
    expect(updated.loadedLevels[1].Enemies).toEqual([updatedEnemy]);
    expect(deleted.loadedLevels[1].Enemies).toEqual([]);
    expect(added.loadedLevels[0].Enemies).toEqual([]);
  });

  it('adds, updates, and deletes obstacles by ID', () => {
    const obstacle = Object.assign(new ObstacleData(), { ID: 3, IsWalkable: false });
    const updatedObstacle = Object.assign(new ObstacleData(), { ID: 3, IsWalkable: true });
    const added = levelReducer(createState(), LevelActions.addObstacle({ obstacle }));
    const updated = levelReducer(added, LevelActions.updateObstacle({ obstacle: updatedObstacle }));
    const deleted = levelReducer(updated, LevelActions.deleteObstacle({ obstacleId: 3 }));

    expect(added.loadedLevels[1].Obstacles).toEqual([obstacle]);
    expect(updated.loadedLevels[1].Obstacles).toEqual([updatedObstacle]);
    expect(deleted.loadedLevels[1].Obstacles).toEqual([]);
    expect(added.loadedLevels[0].Obstacles).toEqual([]);
  });

  it('appends loaded levels and selects the first newly loaded level', () => {
    const state = createState();
    const first = Object.assign(new Level(), { ID: 4 });
    const second = Object.assign(new Level(), { ID: 5 });
    const one = levelReducer(state, LevelActions.loadLevel({ level: first }));
    const many = levelReducer(one, LevelActions.loadLevels({ levels: [second, new Level()] }));

    expect(one.loadedLevels).toEqual([...state.loadedLevels, first]);
    expect(one.selectedLevelIndex).toBe(2);
    expect(many.loadedLevels).toHaveLength(5);
    expect(many.selectedLevelIndex).toBe(3);
    expect(levelReducer(many, LevelActions.loadLevels({ levels: [] })).selectedLevelIndex).toBe(3);
  });

  it('selects only valid level indices and ignores edits without a selected level', () => {
    const state = createState();
    expect(levelReducer(state, LevelActions.selectLevel({ levelIndex: 0 })).selectedLevelIndex).toBe(0);
    expect(levelReducer(state, LevelActions.selectLevel({ levelIndex: -1 }))).toEqual(state);
    expect(levelReducer(state, LevelActions.selectLevel({ levelIndex: 2 }))).toEqual(state);

    const invalidState = { ...state, selectedLevelIndex: -1 };
    expect(levelReducer(invalidState, LevelActions.addPlayer({ player: new PlayerData() }))).toBe(invalidState);
  });

  it('updates win position and only supplied properties, including zero and empty values', () => {
    const state = createState();
    state.loadedLevels[1].LevelDescription = 'Before';
    state.loadedLevels[1].GridWidth = 8;
    const winPosition = Object.assign(new LevelPoint(), { X: 2, Y: 3 });
    const withWin = levelReducer(state, LevelActions.updateWinPosition({ winPosition }));
    const updated = levelReducer(withWin, LevelActions.updateLevelProperties({
      id: 0,
      gridWidth: 0,
      gridHeight: 7,
      cellSize: 32,
      levelType: 1,
      biomeType: 2,
      levelDifficultyType: 1,
      levelDescription: '',
      numberOfTurns: 4
    }));

    expect(withWin.loadedLevels[1].WinPosition).toBe(winPosition);
    expect(updated.loadedLevels[1]).toMatchObject({
      ID: 0, GridWidth: 0, GridHeight: 7, CellSize: 32,
      LevelType: 1, BiomeType: 2, LevelDifficultyType: 1,
      LevelDescription: '', NumberOfTurns: 4, WinPosition: winPosition
    });
    expect(state.loadedLevels[1].LevelDescription).toBe('Before');
    expect(updated.loadedLevels[0]).toBe(state.loadedLevels[0]);
  });

  it('adds, replaces, and removes start positions by index', () => {
    const first = Object.assign(new LevelPoint(), { X: 1 });
    const second = Object.assign(new LevelPoint(), { X: 2 });
    const replacement = Object.assign(new LevelPoint(), { X: 3 });
    const added = levelReducer(createState(), LevelActions.addStartPosition({ startPosition: first }));
    const withTwo = levelReducer(added, LevelActions.addStartPosition({ startPosition: second }));
    const updated = levelReducer(withTwo, LevelActions.updateStartPosition({ index: 0, startPosition: replacement }));
    const deleted = levelReducer(updated, LevelActions.deleteStartPosition({ index: 1 }));

    expect(withTwo.loadedLevels[1].StartPositionsList).toEqual([first, second]);
    expect(updated.loadedLevels[1].StartPositionsList).toEqual([replacement, second]);
    expect(deleted.loadedLevels[1].StartPositionsList).toEqual([replacement]);
    expect(added.loadedLevels[1].StartPositionsList).toEqual([first]);
  });
});