import { createReducer, on } from '@ngrx/store';
import { LevelState, initialLevelState } from './level.state';
import * as LevelActions from './level.actions';

export const levelReducer = createReducer(
  initialLevelState,
  
  on(LevelActions.addPlayer, (state, { player }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      players: [...state.currentLevel.players, player]
    } : state.currentLevel
  })),

  on(LevelActions.addEnemy, (state, { enemy }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      enemies: [...state.currentLevel.enemies, enemy]
    } : state.currentLevel
  })),

  on(LevelActions.addObstacle, (state, { obstacle }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      obstacles: [...state.currentLevel.obstacles, obstacle]
    } : state.currentLevel
  })),

  on(LevelActions.loadLevel, (state, { level }) => ({
    ...state,
    currentLevel: level
  }))
);
