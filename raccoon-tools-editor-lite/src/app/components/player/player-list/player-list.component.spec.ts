import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BasePlayerType, EnemyData, Level, ObstacleData, PlayerData } from '../../../models/level.model';
import { addPlayer } from '../../../store/level.actions';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { PlayerListComponent } from './player-list.component';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;
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
      imports: [PlayerListComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the empty state when no players exist', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('No players added yet');
    expect(fixture.nativeElement.querySelectorAll('app-player-card')).toHaveLength(0);
  });

  it('renders a card for each player', () => {
    const players = [createPlayer({ ID: 2 }), createPlayer({ ID: 5 })];
    store.setState(createState({ Players: players }));
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(PlayerCardComponent));

    expect(cards).toHaveLength(2);
    expect(cards[0].componentInstance.player).toBe(players[0]);
    expect(cards[1].componentInstance.player).toBe(players[1]);
  });

  it('adds a player with the next ID and default values', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      Players: [
        createPlayer({ ID: 3, StartPosition: { X: 1, Y: 1 } }),
        createPlayer({ ID: 8, StartPosition: { X: 2, Y: 2 } })
      ]
    }));

    component.addNewPlayer();

    expect(dispatch).toHaveBeenCalledWith(addPlayer({
      player: expect.objectContaining({
        ID: 9,
        PlayerType: BasePlayerType.Paladin,
        Health: 3,
        Height: 64,
        Width: 64,
        StartPosition: expect.objectContaining({ X: 0, Y: 0 })
      }) as PlayerData
    }));
  });

  it('places a new player in a cell not occupied by another entity', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    store.setState(createState({
      GridWidth: 2,
      GridHeight: 2,
      Players: [createPlayer({ ID: 1, StartPosition: { X: 0, Y: 0 } })],
      Enemies: [Object.assign(new EnemyData(), { ID: 2, StartPosition: { X: 0, Y: 1 } })],
      Obstacles: [Object.assign(new ObstacleData(), { ID: 3, Position: { X: 1, Y: 0 } })]
    }));

    component.addNewPlayer();

    expect(dispatch).toHaveBeenCalledWith(addPlayer({
      player: expect.objectContaining({
        StartPosition: expect.objectContaining({ X: 1, Y: 1 })
      }) as PlayerData
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
      Players: [
        createPlayer({ ID: 1, StartPosition: { X: 0, Y: 0 } }),
        createPlayer({ ID: 2, StartPosition: { X: 0, Y: 1 } }),
        createPlayer({ ID: 3, StartPosition: { X: 1, Y: 0 } }),
        createPlayer({ ID: 4, StartPosition: { X: 1, Y: 1 } })
      ]
    }));

    component.addNewPlayer();

    expect(dispatch).toHaveBeenCalledWith(addPlayer({
      player: expect.objectContaining({
        StartPosition: expect.objectContaining({ X: 1, Y: 0 })
      }) as PlayerData
    }));
  });

  it('hides the visualizer when showVisualizer is false', () => {
    component.showVisualizer = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-visualizer')).toBeNull();
  });

  function createPlayer(overrides: Partial<PlayerData> = {}): PlayerData {
    return Object.assign(new PlayerData(), {
      ID: 1,
      PlayerType: BasePlayerType.Paladin,
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