import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { addStartPosition } from '../../../store/level.actions';
import { StartPositionCardComponent } from '../start-position-card/start-position-card.component';
import { StartPositionListComponent } from './start-position-list.component';

describe('StartPositionListComponent', () => {
  let component: StartPositionListComponent;
  let fixture: ComponentFixture<StartPositionListComponent>;
  let store: MockStore;

  const initialState = {
    level: {
      loadedLevels: [{
        ID: 0,
        GridWidth: 8,
        GridHeight: 8,
        CellSize: 64,
        LevelType: 0,
        LevelDescription: '',
        NumberOfTurns: 0,
        WinPosition: { X: 0, Y: 0 },
        StartPositionsList: [],
        Players: [],
        Enemies: [],
        Obstacles: []
      }],
      selectedLevelIndex: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPositionListComponent],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(StartPositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the empty state when no start positions exist', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('No start positions added yet');
    expect(fixture.nativeElement.querySelectorAll('app-start-position-card')).toHaveLength(0);
  });

  it('renders a card with the correct position and index for each start position', () => {
    store.setState(createState({
      StartPositionsList: [{ X: 1, Y: 2 }, { X: 5, Y: 6 }]
    }));
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(StartPositionCardComponent));

    expect(cards).toHaveLength(2);
    expect(cards[0].componentInstance.startPosition).toEqual({ X: 1, Y: 2 });
    expect(cards[0].componentInstance.index).toBe(0);
    expect(cards[1].componentInstance.startPosition).toEqual({ X: 5, Y: 6 });
    expect(cards[1].componentInstance.index).toBe(1);
  });

  it('adds a start position in the first available cell', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      StartPositionsList: [{ X: 0, Y: 0 }]
    }));

    component.addNewStartPosition();

    expect(dispatch).toHaveBeenCalledWith(addStartPosition({
      startPosition: expect.objectContaining({ X: 0, Y: 1 })
    }));
  });

  it('allows a new start position on a cell occupied by an entity', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      Players: [{ ID: 1, StartPosition: { X: 0, Y: 0 } }],
      Enemies: [{ ID: 2, StartPosition: { X: 1, Y: 0 } }],
      Obstacles: [{ ID: 3, Position: { X: 0, Y: 1 } }]
    }));

    component.addNewStartPosition();

    expect(dispatch).toHaveBeenCalledWith(addStartPosition({
      startPosition: expect.objectContaining({ X: 0, Y: 0 })
    }));
  });

  it('falls back to a grid position when every cell already has a start position', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.75)
      .mockReturnValueOnce(0.25);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      StartPositionsList: [
        { X: 0, Y: 0 },
        { X: 0, Y: 1 },
        { X: 1, Y: 0 },
        { X: 1, Y: 1 }
      ]
    }));

    component.addNewStartPosition();

    expect(dispatch).toHaveBeenCalledWith(addStartPosition({
      startPosition: expect.objectContaining({ X: 1, Y: 0 })
    }));
  });

  it('hides the visualizer when showVisualizer is false', () => {
    component.showVisualizer = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-visualizer')).toBeNull();
  });

  function createState(levelOverrides: Record<string, unknown>) {
    return {
      level: {
        loadedLevels: [{
          ...initialState.level.loadedLevels[0],
          ...levelOverrides
        }],
        selectedLevelIndex: 0
      }
    };
  }
});