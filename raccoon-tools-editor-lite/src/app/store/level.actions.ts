import { createAction, props } from '@ngrx/store';
import { PlayerData, EnemyData, ObstacleData, Level } from '../models/level.model';

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
