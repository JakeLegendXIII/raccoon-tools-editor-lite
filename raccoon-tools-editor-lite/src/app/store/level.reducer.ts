import { createReducer, on } from '@ngrx/store';
import { LevelState, initialLevelState } from './level.state';
import * as LevelActions from './level.actions';

export const levelReducer = createReducer(
  initialLevelState,
  
  on(LevelActions.addPlayer, (state, { player }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Players: [...state.currentLevel.Players, player]
    } : state.currentLevel
  })),
  on(LevelActions.updatePlayer, (state, { player }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Players: state.currentLevel.Players.map(p => 
        p.ID === player.ID ? player : p
      )
    } : state.currentLevel
  })),

  on(LevelActions.addEnemy, (state, { enemy }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Enemies: [...state.currentLevel.Enemies, enemy]
    } : state.currentLevel
  })),

  on(LevelActions.addObstacle, (state, { obstacle }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Obstacles: [...state.currentLevel.Obstacles, obstacle]
    } : state.currentLevel
  })),

  on(LevelActions.loadLevel, (state, { level }) => ({
    ...state,
    currentLevel: level
  }))
);
