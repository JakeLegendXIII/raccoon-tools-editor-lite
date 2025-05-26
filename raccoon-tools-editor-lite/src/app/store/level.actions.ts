import { createAction, props } from '@ngrx/store';
import { PlayerData, EnemyData, ObstacleData } from '../models/level.model';

export const addPlayer = createAction(
  '[Level] Add Player',
  props<{ player: PlayerData }>()
);

export const addEnemy = createAction(
  '[Level] Add Enemy', 
  props<{ enemy: EnemyData }>()
);

export const addObstacle = createAction(
  '[Level] Add Obstacle',
  props<{ obstacle: ObstacleData }>()
);
