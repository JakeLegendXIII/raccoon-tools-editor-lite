import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnemyData, Level, ObstacleData, ObstacleType, PlayerData } from '../../../models/level.model';
import { addObstacle } from '../../../store/level.actions';
import { ObstacleCardComponent } from '../obstacle-card/obstacle-card.component';
import { ObstacleListComponent } from './obstacle-list.component';

describe('ObstacleListComponent', () => {
  let component: ObstacleListComponent;
  let fixture: ComponentFixture<ObstacleListComponent>;
  let store: MockStore;

  const initialLevel = Object.assign(new Level(), {
    ID: 1,
    GridWidth: 3,
    GridHeight: 3
  });

  const initialState = {
    level: {
      loadedLevels: [initialLevel],
      selectedLevelIndex: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObstacleListComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ObstacleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the empty state when no obstacles exist', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('No obstacles added yet');
    expect(fixture.nativeElement.querySelectorAll('app-obstacle-card')).toHaveLength(0);
  });

  it('renders a card for each obstacle', () => {
    const obstacles = [createObstacle({ ID: 2 }), createObstacle({ ID: 5 })];
    store.setState(createState({ Obstacles: obstacles }));
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(ObstacleCardComponent));

    expect(cards).toHaveLength(2);
    expect(cards[0].componentInstance.obstacle).toBe(obstacles[0]);
    expect(cards[1].componentInstance.obstacle).toBe(obstacles[1]);
  });

  it('adds an obstacle with the next ID and default values', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      Obstacles: [
        createObstacle({ ID: 3, Position: { X: 1, Y: 1 } }),
        createObstacle({ ID: 8, Position: { X: 2, Y: 2 } })
      ]
    }));

    component.addNewObstacle();

    expect(dispatch).toHaveBeenCalledWith(addObstacle({
      obstacle: expect.objectContaining({
        ID: 9,
        ObstacleType: ObstacleType.Mountain,
        Health: 3,
        Height: 64,
        Width: 64,
        IsWalkable: false,
        IsDestructible: true,
        Position: expect.objectContaining({ X: 0, Y: 0 })
      }) as ObstacleData
    }));
  });

  it('places a new obstacle in a cell not occupied by another entity', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      Players: [Object.assign(new PlayerData(), { ID: 1, StartPosition: { X: 0, Y: 0 } })],
      Enemies: [Object.assign(new EnemyData(), { ID: 2, StartPosition: { X: 0, Y: 1 } })],
      Obstacles: [createObstacle({ ID: 3, Position: { X: 1, Y: 0 } })]
    }));

    component.addNewObstacle();

    expect(dispatch).toHaveBeenCalledWith(addObstacle({
      obstacle: expect.objectContaining({
        Position: expect.objectContaining({ X: 1, Y: 1 })
      }) as ObstacleData
    }));
  });

  it('falls back to a grid position when every cell is occupied', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.75)
      .mockReturnValueOnce(0.25);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      Obstacles: [
        createObstacle({ ID: 1, Position: { X: 0, Y: 0 } }),
        createObstacle({ ID: 2, Position: { X: 0, Y: 1 } }),
        createObstacle({ ID: 3, Position: { X: 1, Y: 0 } }),
        createObstacle({ ID: 4, Position: { X: 1, Y: 1 } })
      ]
    }));

    component.addNewObstacle();

    expect(dispatch).toHaveBeenCalledWith(addObstacle({
      obstacle: expect.objectContaining({
        Position: expect.objectContaining({ X: 1, Y: 0 })
      }) as ObstacleData
    }));
  });

  it('hides the visualizer when showVisualizer is false', () => {
    component.showVisualizer = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-visualizer')).toBeNull();
  });

  function createObstacle(overrides: Partial<ObstacleData> = {}): ObstacleData {
    return Object.assign(new ObstacleData(), {
      ID: 1,
      ObstacleType: ObstacleType.Mountain,
      Health: 3,
      Height: 64,
      Width: 64,
      IsWalkable: false,
      IsDestructible: true,
      IsInteractive: false,
      Position: { X: 0, Y: 0 }
    }, overrides);
  }

  function createState(levelOverrides: Partial<Level>) {
    return {
      level: {
        loadedLevels: [{
          ...initialLevel,
          ...levelOverrides
        }],
        selectedLevelIndex: 0
      }
    };
  }
});