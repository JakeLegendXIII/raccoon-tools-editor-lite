import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ObstacleData, ObstacleType } from '../../../models/level.model';
import { deleteObstacle, updateObstacle } from '../../../store/level.actions';
import { ObstacleCardComponent } from './obstacle-card.component';

describe('ObstacleCardComponent', () => {
  let component: ObstacleCardComponent;
  let fixture: ComponentFixture<ObstacleCardComponent>;
  let store: MockStore;

  const createObstacle = (overrides: Partial<ObstacleData> = {}): ObstacleData => Object.assign(new ObstacleData(), {
    ID: 4,
    ObstacleType: ObstacleType.Building,
    Health: 5,
    Height: 64,
    Width: 48,
    IsWalkable: false,
    IsDestructible: true,
    IsInteractive: true,
    Position: { X: 2, Y: 3 }
  }, overrides);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObstacleCardComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ObstacleCardComponent);
    component = fixture.componentInstance;
    component.obstacle = createObstacle();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders obstacle details, flags, and the obstacle type name', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Obstacle 4');
    expect(content).toContain('Building');
    expect(content).toContain('Health: 5');
    expect(content).toContain('Size: 48 x 64');
    expect(content).toContain('Walkable: No');
    expect(content).toContain('Destructible: Yes');
    expect(content).toContain('Interactive: Yes');
    expect(content).toContain('Position: (2, 3)');
  });

  it('initializes an option for every obstacle type', () => {
    expect(component.getObstacleTypeOptions()).toEqual([
      { value: ObstacleType.Mountain, name: 'Mountain' },
      { value: ObstacleType.Water, name: 'Water' },
      { value: ObstacleType.Building, name: 'Building' },
      { value: ObstacleType.Wall, name: 'Wall' },
      { value: ObstacleType.Tree, name: 'Tree' },
      { value: ObstacleType.Ice, name: 'Ice' },
      { value: ObstacleType.Rock, name: 'Rock' }
    ]);
    expect(component.getObstacleTypeName(999)).toBe('Unknown');
  });

  it('opens an editable deep copy without mutating the input', () => {
    component.toggleEdit();
    component.editableObstacle.Health = 12;
    component.editableObstacle.Position.X = 7;

    expect(component.isEditing).toBe(true);
    expect(component.editableObstacle.Health).toBe(12);
    expect(component.editableObstacle.Position).toEqual({ X: 7, Y: 3 });
    expect(component.obstacle.Health).toBe(5);
    expect(component.obstacle.Position).toEqual({ X: 2, Y: 3 });
  });

  it('applies defaults when the obstacle type changes', () => {
    component.toggleEdit();
    component.editableObstacle.ObstacleType = ObstacleType.Water;

    component.onObstacleTypeChange();

    expect(component.editableObstacle).toEqual(expect.objectContaining({
      Health: 0,
      IsWalkable: true,
      IsDestructible: false,
      IsInteractive: false
    }));
  });

  it('applies type defaults to legacy data with undefined flags', () => {
    component.obstacle = createObstacle({
      ObstacleType: ObstacleType.Rock,
      IsWalkable: undefined as unknown as boolean,
      IsDestructible: undefined as unknown as boolean
    });

    component.resetEditableObstacle();

    expect(component.editableObstacle).toEqual(expect.objectContaining({
      Health: 1,
      IsWalkable: false,
      IsDestructible: true,
      IsInteractive: false
    }));
  });

  it('dispatches the edited obstacle and closes the editor', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.toggleEdit();
    component.editableObstacle = createObstacle({ Health: 10 });

    component.saveChanges();

    expect(dispatch).toHaveBeenCalledWith(updateObstacle({ obstacle: component.editableObstacle }));
    expect(component.isEditing).toBe(false);
  });

  it('discards edits when cancelled', () => {
    component.toggleEdit();
    component.editableObstacle.Health = 1;
    component.editableObstacle.Position.Y = 9;

    component.cancelEdit();

    expect(component.isEditing).toBe(false);
    expect(component.editableObstacle).toEqual(component.obstacle);
    expect(component.editableObstacle).not.toBe(component.obstacle);
    expect(component.editableObstacle.Position).not.toBe(component.obstacle.Position);
  });

  it('deletes a confirmed obstacle', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => true));

    component.deleteObstacle();

    expect(dispatch).toHaveBeenCalledWith(deleteObstacle({ obstacleId: 4 }));
  });

  it('does not delete when confirmation is declined', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => false));

    component.deleteObstacle();

    expect(dispatch).not.toHaveBeenCalled();
  });
});