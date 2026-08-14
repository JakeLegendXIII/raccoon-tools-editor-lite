import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BaseEnemyType,
  BasePlayerType,
  BiomeType,
  EnemyData,
  Level,
  LevelDifficultyType,
  LevelType,
  ObstacleData,
  ObstacleType,
  PlayerData
} from '../../models/level.model';
import {
  loadLevel,
  selectLevel,
  updateLevelProperties,
  updateWinPosition
} from '../../store/level.actions';
import { LevelHeaderComponent } from './level-header.component';

describe('LevelHeaderComponent', () => {
  let component: LevelHeaderComponent;
  let fixture: ComponentFixture<LevelHeaderComponent>;
  let store: MockStore;

  const firstLevel = createLevel({
    ID: 3,
    LevelDescription: 'Forest Run',
    Players: [createPlayer()],
    Enemies: [createEnemy()],
    Obstacles: [createObstacle()]
  });
  const secondLevel = createLevel({ ID: 8, LevelDescription: '  Final Stand  ' });

  const initialState = {
    level: {
      loadedLevels: [firstLevel, secondLevel],
      selectedLevelIndex: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelHeaderComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LevelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders selected level properties and entity summaries', () => {
    const content = fixture.nativeElement.textContent;
    const getInput = (id: string): HTMLInputElement => fixture.nativeElement.querySelector(`#${id}`);

    expect(getInput('id').value).toBe('3');
    expect(getInput('gridWidth').value).toBe('10');
    expect(getInput('gridHeight').value).toBe('6');
    expect(getInput('cellSize').value).toBe('32');
    expect(getInput('levelDescription').value).toBe('Forest Run');
    expect(getInput('winX').value).toBe('4');
    expect(getInput('winY').value).toBe('5');
    expect(getInput('numberOfTurns').value).toBe('12');
    expect(content).toContain('Players (1)');
    expect(content).toContain('Player 1 - Type: Fighter');
    expect(content).toContain('Enemy 2 - Type: Boss');
    expect(content).toContain('Obstacle 3 - Type: Wall');
  });

  it('builds enum options and returns fallback names', () => {
    expect(component.levelTypeOptions).toEqual([
      { name: 'Deathmatch', value: LevelType.Deathmatch },
      { name: 'Survive', value: LevelType.Survive },
      { name: 'Escape', value: LevelType.Escape },
      { name: 'Boss', value: LevelType.Boss }
    ]);
    expect(component.biomeTypeOptions).toEqual([
      { name: 'Forest', value: BiomeType.Forest },
      { name: 'Desert', value: BiomeType.Desert },
      { name: 'Tundra', value: BiomeType.Tundra }
    ]);
    expect(component.levelDifficultyTypeKeys).toEqual([
      { name: 'Easy', value: LevelDifficultyType.Easy },
      { name: 'Medium', value: LevelDifficultyType.Medium },
      { name: 'Hard', value: LevelDifficultyType.Hard }
    ]);
    expect(component.getLevelTypeName(999)).toBe('Unknown');
    expect(component.getBiomeTypeName(999)).toBe('Unknown');
    expect(component.getLevelDifficultyTypeName(999)).toBe('Unknown');
  });

  it('dispatches updates for every level property', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    component.updateID(14);
    component.updateGridWidth(11);
    component.updateGridHeight(9);
    component.updateCellSize(128);
    component.updateLevelType('2');
    component.updateBiomeType('1');
    component.updateLevelDifficultyType('2');
    component.updateLevelDescription('Updated level');
    component.updateNumberOfTurns(25);

    expect(dispatch).toHaveBeenNthCalledWith(1, updateLevelProperties({ id: 14 }));
    expect(dispatch).toHaveBeenNthCalledWith(2, updateLevelProperties({ gridWidth: 11 }));
    expect(dispatch).toHaveBeenNthCalledWith(3, updateLevelProperties({ gridHeight: 9 }));
    expect(dispatch).toHaveBeenNthCalledWith(4, updateLevelProperties({ cellSize: 128 }));
    expect(dispatch).toHaveBeenNthCalledWith(5, updateLevelProperties({ levelType: LevelType.Escape }));
    expect(dispatch).toHaveBeenNthCalledWith(6, updateLevelProperties({ biomeType: BiomeType.Desert }));
    expect(dispatch).toHaveBeenNthCalledWith(7, updateLevelProperties({ levelDifficultyType: LevelDifficultyType.Hard }));
    expect(dispatch).toHaveBeenNthCalledWith(8, updateLevelProperties({ levelDescription: 'Updated level' }));
    expect(dispatch).toHaveBeenNthCalledWith(9, updateLevelProperties({ numberOfTurns: 25 }));
  });

  it('keeps the unchanged win coordinate when an input changes', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    component.onWinXChange(createInputEvent('7'));
    component.onWinYChange(createInputEvent('9'));

    expect(dispatch).toHaveBeenNthCalledWith(1, updateWinPosition({ winPosition: { X: 7, Y: 5 } }));
    expect(dispatch).toHaveBeenNthCalledWith(2, updateWinPosition({ winPosition: { X: 4, Y: 9 } }));
  });

  it('converts numeric input events before dispatching updates', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    component.onIDChange(createInputEvent('10'));
    component.onGridWidthChange(createInputEvent('12'));
    component.onGridHeightChange(createInputEvent('7'));
    component.onCellSizeChange(createInputEvent('96'));
    component.onNumberOfTurnsChange(createInputEvent('30'));
    component.onLevelDescriptionInput(createInputEvent('Input description'));

    expect(dispatch).toHaveBeenNthCalledWith(1, updateLevelProperties({ id: 10 }));
    expect(dispatch).toHaveBeenNthCalledWith(2, updateLevelProperties({ gridWidth: 12 }));
    expect(dispatch).toHaveBeenNthCalledWith(3, updateLevelProperties({ gridHeight: 7 }));
    expect(dispatch).toHaveBeenNthCalledWith(4, updateLevelProperties({ cellSize: 96 }));
    expect(dispatch).toHaveBeenNthCalledWith(5, updateLevelProperties({ numberOfTurns: 30 }));
    expect(dispatch).toHaveBeenNthCalledWith(6, updateLevelProperties({ levelDescription: 'Input description' }));
  });

  it('creates a level with the next ID and defaults', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    component.createLevel();

    expect(dispatch).toHaveBeenCalledWith(loadLevel({
      level: expect.objectContaining({
        ID: 9,
        GridWidth: 8,
        GridHeight: 8,
        CellSize: 64,
        LevelDescription: 'Level 9',
        NumberOfTurns: 0
      }) as Level
    }));
  });

  it('duplicates the selected level with a new ID and deep-copied entities', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    component.duplicateLevel();

    expect(dispatch).toHaveBeenCalledOnce();
    const action = dispatch.mock.calls[0][0] as unknown as ReturnType<typeof loadLevel>;
    const duplicatedLevel = action.level;
    expect(duplicatedLevel).toEqual(expect.objectContaining({
      ID: 9,
      GridWidth: 10,
      GridHeight: 6,
      CellSize: 32,
      LevelDescription: 'Forest Run Copy'
    }));
    expect(duplicatedLevel).not.toBe(firstLevel);
    expect(duplicatedLevel.WinPosition).not.toBe(firstLevel.WinPosition);
    expect(duplicatedLevel.StartPositionsList[0]).not.toBe(firstLevel.StartPositionsList[0]);
    expect(duplicatedLevel.Players[0]).not.toBe(firstLevel.Players[0]);
    expect(duplicatedLevel.Players[0].StartPosition).not.toBe(firstLevel.Players[0].StartPosition);
    expect(duplicatedLevel.Enemies[0]).not.toBe(firstLevel.Enemies[0]);
    expect(duplicatedLevel.Obstacles[0]).not.toBe(firstLevel.Obstacles[0]);
    expect(duplicatedLevel.Obstacles[0].Position).not.toBe(firstLevel.Obstacles[0].Position);
  });

  it('uses a generated description when duplicating an untitled level', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    store.setState(createState([createLevel({ ID: 4, LevelDescription: '   ' })], 0));

    component.duplicateLevel();

    expect(dispatch).toHaveBeenCalledWith(loadLevel({
      level: expect.objectContaining({ ID: 5, LevelDescription: 'Level 5' }) as Level
    }));
  });

  it('does not duplicate when no level is selected', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    store.setState(createState([], 0));

    component.duplicateLevel();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('selects a level from a numeric string', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    component.selectLevel('1');

    expect(dispatch).toHaveBeenCalledWith(selectLevel({ levelIndex: 1 }));
  });

  it('formats level option labels with ID and description fallbacks', () => {
    expect(component.getLevelOptionLabel(createLevel({ ID: 7, LevelDescription: ' Arena ' }), 0)).toBe('7 - Arena');
    expect(component.getLevelOptionLabel(createLevel({ ID: 0, LevelDescription: ' ' }), 2)).toBe('3 - Untitled Level');
  });

  it('hides optional title, entity lists, and visualizer', () => {
    component.showTitle = false;
    component.showEntityLists = false;
    component.showVisualizer = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.component-header')).toBeNull();
    expect(fixture.nativeElement.querySelector('.lists')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-visualizer')).toBeNull();
  });

  function createLevel(overrides: Partial<Level> = {}): Level {
    return Object.assign(new Level(), {
      ID: 1,
      GridWidth: 10,
      GridHeight: 6,
      CellSize: 32,
      LevelType: LevelType.Survive,
      LevelDescription: 'Test Level',
      BiomeType: BiomeType.Tundra,
      LevelDifficultyType: LevelDifficultyType.Hard,
      NumberOfTurns: 12,
      WinPosition: { X: 4, Y: 5 },
      StartPositionsList: [{ X: 1, Y: 2 }],
      Players: [],
      Enemies: [],
      Obstacles: []
    }, overrides);
  }

  function createPlayer(): PlayerData {
    return Object.assign(new PlayerData(), {
      ID: 1,
      PlayerType: BasePlayerType.Fighter,
      Health: 3,
      Height: 64,
      Width: 64,
      StartPosition: { X: 1, Y: 1 }
    });
  }

  function createEnemy(): EnemyData {
    return Object.assign(new EnemyData(), {
      ID: 2,
      EnemyType: BaseEnemyType.Boss,
      Health: 5,
      Height: 64,
      Width: 64,
      StartPosition: { X: 2, Y: 2 }
    });
  }

  function createObstacle(): ObstacleData {
    return Object.assign(new ObstacleData(), {
      ID: 3,
      ObstacleType: ObstacleType.Wall,
      Health: 3,
      Height: 64,
      Width: 64,
      IsWalkable: false,
      IsDestructible: true,
      IsInteractive: false,
      Position: { X: 3, Y: 3 }
    });
  }

  function createInputEvent(value: string): Event {
    return { target: { value } } as unknown as Event;
  }

  function createState(loadedLevels: Level[], selectedLevelIndex: number) {
    return { level: { loadedLevels, selectedLevelIndex } };
  }
});