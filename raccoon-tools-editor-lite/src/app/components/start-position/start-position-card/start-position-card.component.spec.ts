import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteStartPosition, updateStartPosition } from '../../../store/level.actions';
import { StartPositionCardComponent } from './start-position-card.component';

describe('StartPositionCardComponent', () => {
  let component: StartPositionCardComponent;
  let fixture: ComponentFixture<StartPositionCardComponent>;
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
      imports: [StartPositionCardComponent],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(StartPositionCardComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.startPosition = { X: 0, Y: 0 };
    component.index = 0;
    
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders its number and coordinates', () => {
    component.startPosition = { X: 3, Y: 5 };
    component.index = 1;
    component.resetEditableStartPosition();
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Start Position 2');
    expect(content).toContain('Position: (3, 5)');
    expect(content).toContain('X Position: 3');
    expect(content).toContain('Y Position: 5');
  });

  it('opens an editable copy without mutating the input', () => {
    component.startPosition = { X: 2, Y: 4 };

    component.toggleEdit();
    component.editableStartPosition.X = 7;

    expect(component.isEditing).toBe(true);
    expect(component.editableStartPosition).toEqual({ X: 7, Y: 4 });
    expect(component.startPosition).toEqual({ X: 2, Y: 4 });
  });

  it('dispatches the edited position and closes the editor', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.index = 3;
    component.toggleEdit();
    component.editableStartPosition = { X: 6, Y: 1 };

    component.saveChanges();

    expect(dispatch).toHaveBeenCalledWith(updateStartPosition({
      index: 3,
      startPosition: { X: 6, Y: 1 }
    }));
    expect(component.isEditing).toBe(false);
  });

  it('discards edits when cancelled', () => {
    component.startPosition = { X: 1, Y: 2 };
    component.toggleEdit();
    component.editableStartPosition = { X: 7, Y: 7 };

    component.cancelEdit();

    expect(component.isEditing).toBe(false);
    expect(component.editableStartPosition).toEqual({ X: 1, Y: 2 });
  });

  it('deletes a confirmed start position', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => true));
    component.index = 2;

    component.deleteStartPosition();

    expect(dispatch).toHaveBeenCalledWith(deleteStartPosition({ index: 2 }));
  });

  it('does not delete when confirmation is declined', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => false));

    component.deleteStartPosition();

    expect(dispatch).not.toHaveBeenCalled();
  });
});