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

export const addObstacle = createAction(
  '[Level] Add Obstacle',
  props<{ obstacle: ObstacleData }>()
);

export const loadLevel = createAction(
  '[Level] Load Level',
  props<{ level: Level }>()
);
