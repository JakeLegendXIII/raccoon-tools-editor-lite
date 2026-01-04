import { createAction, props } from '@ngrx/store';
import { PlayerData, EnemyData, ObstacleData, Level, LevelPoint } from '../models/level.model';

export const addPlayer = createAction(
  '[Level] Add Player',
  props<{ player: PlayerData }>()
);

export const updatePlayer = createAction(
  '[Level] Update Player',
  props<{ player: PlayerData }>()
);

export const deletePlayer = createAction(
  '[Level] Delete Player',
  props<{ playerId: number }>()
);

export const addEnemy = createAction(
  '[Level] Add Enemy', 
  props<{ enemy: EnemyData }>()
);

export const updateEnemy = createAction(
    '[Level] Update Enemy',
    props<{ enemy: EnemyData }>()
);

export const deleteEnemy = createAction(
  '[Level] Delete Enemy',
  props<{ enemyId: number }>()
);

export const addObstacle = createAction(
  '[Level] Add Obstacle',
  props<{ obstacle: ObstacleData }>()
);

export const updateObstacle = createAction(
  '[Level] Update Obstacle',
  props<{ obstacle: ObstacleData }>()
);

export const deleteObstacle = createAction(
  '[Level] Delete Obstacle',
  props<{ obstacleId: number }>()
);

export const loadLevel = createAction(
  '[Level] Load Level',
  props<{ level: Level }>()
);

export const updateWinPosition = createAction(
  '[Level] Update Level Win Position',
  props<{ winPosition: LevelPoint }>()
);

export const updateLevelProperties = createAction(
  '[Level] Update Level Properties',
  props<{ 
    id?: number;
    gridWidth?: number;
    gridHeight?: number;
    cellSize?: number;
    levelType?: number;
    biomeType?: number;
    levelDescription?: string;
    numberOfTurns?: number;
  }>()
);

// Start Position Actions
export const addStartPosition = createAction(
  '[Level] Add Start Position',
  props<{ startPosition: LevelPoint }>()
);

export const updateStartPosition = createAction(
  '[Level] Update Start Position',
  props<{ index: number; startPosition: LevelPoint }>()
);

export const deleteStartPosition = createAction(
  '[Level] Delete Start Position',
  props<{ index: number }>()
);
