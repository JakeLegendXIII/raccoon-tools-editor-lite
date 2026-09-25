import { describe, expect, it } from 'vitest';

import { EnemyData, Level, LevelPoint, ObstacleData, PlayerData } from '../models/level.model';
import * as LevelActions from './level.actions';

describe('level actions', () => {
  const player = new PlayerData();
  const enemy = new EnemyData();
  const obstacle = new ObstacleData();
  const level = new Level();
  const position = new LevelPoint();

  it.each([
    [LevelActions.addPlayer({ player }), '[Level] Add Player', { player }],
    [LevelActions.updatePlayer({ player }), '[Level] Update Player', { player }],
    [LevelActions.deletePlayer({ playerId: 2 }), '[Level] Delete Player', { playerId: 2 }],
    [LevelActions.addEnemy({ enemy }), '[Level] Add Enemy', { enemy }],
    [LevelActions.updateEnemy({ enemy }), '[Level] Update Enemy', { enemy }],
    [LevelActions.deleteEnemy({ enemyId: 3 }), '[Level] Delete Enemy', { enemyId: 3 }],
    [LevelActions.addObstacle({ obstacle }), '[Level] Add Obstacle', { obstacle }],
    [LevelActions.updateObstacle({ obstacle }), '[Level] Update Obstacle', { obstacle }],
    [LevelActions.deleteObstacle({ obstacleId: 4 }), '[Level] Delete Obstacle', { obstacleId: 4 }],
    [LevelActions.loadLevel({ level }), '[Level] Load Level', { level }],
    [LevelActions.loadLevels({ levels: [level] }), '[Level] Load Levels', { levels: [level] }],
    [LevelActions.selectLevel({ levelIndex: 1 }), '[Level] Select Level', { levelIndex: 1 }],
    [LevelActions.updateWinPosition({ winPosition: position }), '[Level] Update Level Win Position', { winPosition: position }],
    [LevelActions.updateLevelProperties({ id: 0, levelDescription: '' }), '[Level] Update Level Properties', { id: 0, levelDescription: '' }],
    [LevelActions.addStartPosition({ startPosition: position }), '[Level] Add Start Position', { startPosition: position }],
    [LevelActions.updateStartPosition({ index: 0, startPosition: position }), '[Level] Update Start Position', { index: 0, startPosition: position }],
    [LevelActions.deleteStartPosition({ index: 0 }), '[Level] Delete Start Position', { index: 0 }]
  ])('creates %s with the expected type and payload', (action, type, payload) => {
    expect(action).toEqual({ type, ...payload });
  });
});