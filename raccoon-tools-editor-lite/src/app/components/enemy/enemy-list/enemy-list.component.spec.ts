import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseEnemyType, EnemyData, Level, ObstacleData, PlayerData } from '../../../models/level.model';
import { addEnemy } from '../../../store/level.actions';
import { EnemyCardComponent } from '../enemy-card/enemy-card.component';
import { EnemyListComponent } from './enemy-list.component';

describe('EnemyListComponent', () => {
  let component: EnemyListComponent;
  let fixture: ComponentFixture<EnemyListComponent>;
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
      imports: [EnemyListComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EnemyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the empty state when no enemies exist', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('No enemies added yet');
    expect(fixture.nativeElement.querySelectorAll('app-enemy-card')).toHaveLength(0);
  });

  it('renders a card for each enemy', () => {
    const enemies = [createEnemy({ ID: 2 }), createEnemy({ ID: 5 })];
    store.setState(createState({ Enemies: enemies }));
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(EnemyCardComponent));

    expect(cards).toHaveLength(2);
    expect(cards[0].componentInstance.enemy).toBe(enemies[0]);
    expect(cards[1].componentInstance.enemy).toBe(enemies[1]);
  });

  it('adds an enemy with the next ID and default values', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      Enemies: [
        createEnemy({ ID: 3, StartPosition: { X: 1, Y: 1 } }),
        createEnemy({ ID: 8, StartPosition: { X: 2, Y: 2 } })
      ]
    }));

    component.addNewEnemy();

    expect(dispatch).toHaveBeenCalledWith(addEnemy({
      enemy: expect.objectContaining({
        ID: 9,
        EnemyType: BaseEnemyType.Grunt,
        Health: 3,
        Height: 64,
        Width: 64,
        StartPosition: expect.objectContaining({ X: 0, Y: 0 })
      }) as EnemyData
    }));
  });

  it('places a new enemy in a cell not occupied by another entity', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      Players: [Object.assign(new PlayerData(), { ID: 1, StartPosition: { X: 0, Y: 0 } })],
      Enemies: [createEnemy({ ID: 2, StartPosition: { X: 0, Y: 1 } })],
      Obstacles: [Object.assign(new ObstacleData(), { ID: 3, Position: { X: 1, Y: 0 } })]
    }));

    component.addNewEnemy();

    expect(dispatch).toHaveBeenCalledWith(addEnemy({
      enemy: expect.objectContaining({
        StartPosition: expect.objectContaining({ X: 1, Y: 1 })
      }) as EnemyData
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
      Enemies: [
        createEnemy({ ID: 1, StartPosition: { X: 0, Y: 0 } }),
        createEnemy({ ID: 2, StartPosition: { X: 0, Y: 1 } }),
        createEnemy({ ID: 3, StartPosition: { X: 1, Y: 0 } }),
        createEnemy({ ID: 4, StartPosition: { X: 1, Y: 1 } })
      ]
    }));

    component.addNewEnemy();

    expect(dispatch).toHaveBeenCalledWith(addEnemy({
      enemy: expect.objectContaining({
        StartPosition: expect.objectContaining({ X: 1, Y: 0 })
      }) as EnemyData
    }));
  });

  it('hides the visualizer when showVisualizer is false', () => {
    component.showVisualizer = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-visualizer')).toBeNull();
  });

  function createEnemy(overrides: Partial<EnemyData> = {}): EnemyData {
    return Object.assign(new EnemyData(), {
      ID: 1,
      EnemyType: BaseEnemyType.Grunt,
      Health: 3,
      Height: 64,
      Width: 64,
      StartPosition: { X: 0, Y: 0 }
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