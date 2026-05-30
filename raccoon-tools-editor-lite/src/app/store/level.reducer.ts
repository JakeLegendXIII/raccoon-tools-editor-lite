import { createReducer, on, State } from '@ngrx/store';
import { LevelState, initialLevelState } from './level.state';
import * as LevelActions from './level.actions';

const updateSelectedLevel = (
  state: LevelState,
  updater: (level: NonNullable<LevelState['loadedLevels'][number]>) => LevelState['loadedLevels'][number]
): LevelState => {
  if (state.selectedLevelIndex < 0 || state.selectedLevelIndex >= state.loadedLevels.length) {
    return state;
  }

  return {
    ...state,
    loadedLevels: state.loadedLevels.map((level, index) =>
      index === state.selectedLevelIndex ? updater(level) : level
    )
  };
};

export const levelReducer = createReducer(
  initialLevelState,
  
  on(LevelActions.addPlayer, (state, { player }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Players: [...level.Players, player]
    }))
  ),
  on(LevelActions.updatePlayer, (state, { player }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Players: level.Players.map(p => 
        p.ID === player.ID ? player : p
      )
    }))
  ),
  on(LevelActions.deletePlayer, (state, { playerId }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Players: level.Players.filter(p => p.ID !== playerId)
    }))
  ),

  on(LevelActions.addEnemy, (state, { enemy }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Enemies: [...level.Enemies, enemy]
    }))
  ),
  on(LevelActions.updateEnemy, (state, { enemy }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Enemies: level.Enemies.map(e => 
        e.ID === enemy.ID ? enemy : e
      )
    }))
  ),
  on(LevelActions.deleteEnemy, (state, { enemyId }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Enemies: level.Enemies.filter(e => e.ID !== enemyId)
    }))
  ),

  on(LevelActions.addObstacle, (state, { obstacle }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Obstacles: [...level.Obstacles, obstacle]
    }))
  ),
  on(LevelActions.updateObstacle, (state, { obstacle }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Obstacles: level.Obstacles.map(o => 
        o.ID === obstacle.ID ? obstacle : o
      )
    }))
  ),
  on(LevelActions.deleteObstacle, (state, { obstacleId }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      Obstacles: level.Obstacles.filter(o => o.ID !== obstacleId)
    }))
  ),

  on(LevelActions.loadLevel, (state, { level }) => ({
    ...state,
    loadedLevels: [...state.loadedLevels, level],
    selectedLevelIndex: state.loadedLevels.length
  })),

  on(LevelActions.loadLevels, (state, { levels }) => ({
    ...state,
    loadedLevels: [...state.loadedLevels, ...levels],
    selectedLevelIndex: levels.length > 0 ? state.loadedLevels.length : state.selectedLevelIndex
  })),

  on(LevelActions.selectLevel, (state, { levelIndex }) => ({
    ...state,
    selectedLevelIndex:
      levelIndex >= 0 && levelIndex < state.loadedLevels.length
        ? levelIndex
        : state.selectedLevelIndex
  })),
  
  on(LevelActions.updateWinPosition, (state, { winPosition }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      WinPosition: winPosition
    }))
  ),

  on(LevelActions.updateLevelProperties, (state, { id, gridWidth, gridHeight, cellSize, levelType, biomeType, levelDescription, numberOfTurns }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      ...(id !== undefined && { ID: id }),
      ...(gridWidth !== undefined && { GridWidth: gridWidth }),
      ...(gridHeight !== undefined && { GridHeight: gridHeight }),
      ...(cellSize !== undefined && { CellSize: cellSize }),
      ...(levelType !== undefined && { LevelType: levelType }),
      ...(biomeType !== undefined && { BiomeType: biomeType }),
      ...(levelDescription !== undefined && { LevelDescription: levelDescription }),
      ...(numberOfTurns !== undefined && { NumberOfTurns: numberOfTurns })
    }))
  ),

  // Start Position Actions
  on(LevelActions.addStartPosition, (state, { startPosition }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      StartPositionsList: [...level.StartPositionsList, startPosition]
    }))
  ),

  on(LevelActions.updateStartPosition, (state, { index, startPosition }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      StartPositionsList: level.StartPositionsList.map((pos, i) => 
        i === index ? startPosition : pos
      )
    }))
  ),

  on(LevelActions.deleteStartPosition, (state, { index }) =>
    updateSelectedLevel(state, (level) => ({
      ...level,
      StartPositionsList: level.StartPositionsList.filter((_, i) => i !== index)
    }))
  )
);
