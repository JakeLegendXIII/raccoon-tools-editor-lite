import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BasePlayerType, PlayerData } from '../../../models/level.model';
import { deletePlayer, updatePlayer } from '../../../store/level.actions';
import { PlayerCardComponent } from './player-card.component';

describe('PlayerCardComponent', () => {
  let component: PlayerCardComponent;
  let fixture: ComponentFixture<PlayerCardComponent>;
  let store: MockStore;

  const createPlayer = (overrides: Partial<PlayerData> = {}): PlayerData => Object.assign(new PlayerData(), {
    ID: 4,
    PlayerType: BasePlayerType.Fighter,
    Health: 8,
    Height: 64,
    Width: 48,
    StartPosition: { X: 2, Y: 3 }
  }, overrides);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCardComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PlayerCardComponent);
    component = fixture.componentInstance;
    component.player = createPlayer();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders player details and the player type name', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Player 4');
    expect(content).toContain('Fighter');
    expect(content).toContain('Health: 8');
    expect(content).toContain('Size: 48 x 64');
    expect(content).toContain('Start Position: (2, 3)');
  });

  it('initializes an option for every player type', () => {
    expect(component.getPlayerTypeOptions()).toEqual([
      { value: BasePlayerType.Paladin, name: 'Paladin' },
      { value: BasePlayerType.Fighter, name: 'Fighter' },
      { value: BasePlayerType.Ship, name: 'Ship' }
    ]);
    expect(component.getPlayerTypeName(999)).toBe('Unknown');
  });

  it('opens an editable deep copy without mutating the input', () => {
    component.toggleEdit();
    component.editablePlayer.Health = 12;
    component.editablePlayer.StartPosition.X = 7;

    expect(component.isEditing).toBe(true);
    expect(component.editablePlayer.Health).toBe(12);
    expect(component.editablePlayer.StartPosition).toEqual({ X: 7, Y: 3 });
    expect(component.player.Health).toBe(8);
    expect(component.player.StartPosition).toEqual({ X: 2, Y: 3 });
  });

  it('dispatches the edited player and closes the editor', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.toggleEdit();
    component.editablePlayer = createPlayer({ Health: 10 });

    component.saveChanges();

    expect(dispatch).toHaveBeenCalledWith(updatePlayer({ player: component.editablePlayer }));
    expect(component.isEditing).toBe(false);
  });

  it('discards edits when cancelled', () => {
    component.toggleEdit();
    component.editablePlayer.Health = 1;
    component.editablePlayer.StartPosition.Y = 9;

    component.cancelEdit();

    expect(component.isEditing).toBe(false);
    expect(component.editablePlayer).toEqual(component.player);
    expect(component.editablePlayer).not.toBe(component.player);
    expect(component.editablePlayer.StartPosition).not.toBe(component.player.StartPosition);
  });

  it('deletes a confirmed player', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => true));

    component.deletePlayer();

    expect(dispatch).toHaveBeenCalledWith(deletePlayer({ playerId: 4 }));
  });

  it('does not delete when confirmation is declined', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => false));

    component.deletePlayer();

    expect(dispatch).not.toHaveBeenCalled();
  });
});