import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionPanel } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnemyData, Level, ObstacleData, PlayerData } from '../../models/level.model';
import { EnemyListComponent } from '../enemy/enemy-list/enemy-list.component';
import { LevelHeaderComponent } from '../level-header/level-header.component';
import { ObstacleListComponent } from '../obstacle/obstacle-list/obstacle-list.component';
import { PlayerListComponent } from '../player/player-list/player-list.component';
import { StartPositionListComponent } from '../start-position/start-position-list/start-position-list.component';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import { LevelEditorComponent } from './level-editor.component';

describe('LevelEditorComponent', () => {
  let component: LevelEditorComponent;
  let fixture: ComponentFixture<LevelEditorComponent>;
  let store: MockStore;

  const initialLevel = createLevel({
    Players: [new PlayerData(), new PlayerData()],
    Enemies: [new EnemyData()],
    Obstacles: [new ObstacleData(), new ObstacleData(), new ObstacleData()],
    StartPositionsList: [{ X: 0, Y: 0 }, { X: 1, Y: 1 }]
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelEditorComponent],
      providers: [provideMockStore({
        initialState: createState([initialLevel], 0)
      })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LevelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('maps current level entities to panel counts', async () => {
    await expect(firstValueFrom(component.counts$)).resolves.toEqual({
      players: 2,
      enemies: 1,
      obstacles: 3,
      startPositions: 2
    });
  });

  it('returns zero counts when no level is selected', async () => {
    store.setState(createState([], 0));

    await expect(firstValueFrom(component.counts$)).resolves.toEqual({
      players: 0,
      enemies: 0,
      obstacles: 0,
      startPositions: 0
    });
  });

  it('updates panel descriptions when the selected level changes', () => {
    store.setState(createState([
      initialLevel,
      createLevel({
        Players: [new PlayerData()],
        Enemies: [new EnemyData(), new EnemyData()],
        Obstacles: [],
        StartPositionsList: [{ X: 2, Y: 3 }, { X: 4, Y: 5 }, { X: 6, Y: 7 }]
      })
    ], 1));
    fixture.detectChanges();

    const descriptions = getPanels().slice(1).map(panel =>
      panel.nativeElement.querySelector('mat-panel-description').textContent.trim()
    );
    expect(descriptions).toEqual(['1', '2', '0', '3']);
  });

  it('renders all editor panels with level properties expanded initially', () => {
    const panels = getPanels();

    expect(panels).toHaveLength(5);
    expect(panels.map(panel => panel.componentInstance.expanded)).toEqual([true, false, false, false, false]);
    expect(panels.map(panel => panel.nativeElement.textContent)).toEqual([
      expect.stringContaining('Level Properties'),
      expect.stringContaining('Players'),
      expect.stringContaining('Enemies'),
      expect.stringContaining('Obstacles'),
      expect.stringContaining('Start Positions')
    ]);
  });

  it('configures the embedded level header without duplicate content', () => {
    const header = fixture.debugElement.query(By.directive(LevelHeaderComponent)).componentInstance as LevelHeaderComponent;

    expect(header.showVisualizer).toBe(false);
    expect(header.showEntityLists).toBe(false);
    expect(header.showTitle).toBe(false);
  });

  it('configures each lazy entity list without its own visualizer', () => {
    const panels = getPanels();

    panels[1].componentInstance.open();
    fixture.detectChanges();
    expect(getComponent(PlayerListComponent).showVisualizer).toBe(false);

    panels[2].componentInstance.open();
    fixture.detectChanges();
    expect(getComponent(EnemyListComponent).showVisualizer).toBe(false);

    panels[3].componentInstance.open();
    fixture.detectChanges();
    expect(getComponent(ObstacleListComponent).showVisualizer).toBe(false);

    panels[4].componentInstance.open();
    fixture.detectChanges();
    expect(getComponent(StartPositionListComponent).showVisualizer).toBe(false);
  });

  it('renders one shared visualizer outside the expansion panels', () => {
    const visualizers = fixture.debugElement.queryAll(By.directive(VisualizerComponent));

    expect(visualizers).toHaveLength(1);
    expect(visualizers[0].nativeElement.closest('.visualizer-column')).not.toBeNull();
  });

  function getPanels() {
    return fixture.debugElement.queryAll(By.directive(MatExpansionPanel));
  }

  function getComponent<T>(componentType: new (...args: never[]) => T): T {
    return fixture.debugElement.query(By.directive(componentType)).componentInstance as T;
  }

  function createLevel(overrides: Partial<Level> = {}): Level {
    return Object.assign(new Level(), overrides);
  }

  function createState(loadedLevels: Level[], selectedLevelIndex: number) {
    return { level: { loadedLevels, selectedLevelIndex } };
  }
});