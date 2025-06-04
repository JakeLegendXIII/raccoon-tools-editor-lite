import { createReducer, on, State } from '@ngrx/store';
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
  on(LevelActions.deletePlayer, (state, { playerId }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Players: state.currentLevel.Players.filter(p => p.ID !== playerId)
    } : state.currentLevel
  })),

  on(LevelActions.addEnemy, (state, { enemy }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Enemies: [...state.currentLevel.Enemies, enemy]
    } : state.currentLevel
  })),
  on(LevelActions.updateEnemy, (state, { enemy }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Enemies: state.currentLevel.Enemies.map(e => 
        e.ID === enemy.ID ? enemy : e
      )
    } : state.currentLevel
    })),
  on(LevelActions.deleteEnemy, (state, { enemyId }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Enemies: state.currentLevel.Enemies.filter(e => e.ID !== enemyId)
    } : state.currentLevel
  })),

  on(LevelActions.addObstacle, (state, { obstacle }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Obstacles: [...state.currentLevel.Obstacles, obstacle]
    } : state.currentLevel
  })),
  on(LevelActions.updateObstacle, (state, { obstacle }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Obstacles: state.currentLevel.Obstacles.map(o => 
        o.ID === obstacle.ID ? obstacle : o
      )
    } : state.currentLevel
  })),
  on(LevelActions.deleteObstacle, (state, { obstacleId }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      Obstacles: state.currentLevel.Obstacles.filter(o => o.ID !== obstacleId)
    } : state.currentLevel
  })),

  on(LevelActions.loadLevel, (state, { level }) => ({
    ...state,
    currentLevel: level
  })),
  
  on(LevelActions.updateWinPosition, (state, { winPosition }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      WinPosition: winPosition
    } : state.currentLevel
  })),

  on(LevelActions.updateLevelProperties, (state, { gridWidth, gridHeight, cellSize, levelType, levelDescription }) => ({
    ...state,
    currentLevel: state.currentLevel ? {
      ...state.currentLevel,
      ...(gridWidth !== undefined && { GridWidth: gridWidth }),
      ...(gridHeight !== undefined && { GridHeight: gridHeight }),
      ...(cellSize !== undefined && { CellSize: cellSize }),
      ...(levelType !== undefined && { LevelType: levelType }),
      ...(levelDescription !== undefined && { LevelDescription: levelDescription })
    } : state.currentLevel
  }))
);
