import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseEnemyType, EnemyData } from '../../../models/level.model';
import { deleteEnemy, updateEnemy } from '../../../store/level.actions';
import { EnemyCardComponent } from './enemy-card.component';

describe('EnemyCardComponent', () => {
  let component: EnemyCardComponent;
  let fixture: ComponentFixture<EnemyCardComponent>;
  let store: MockStore;

  const createEnemy = (overrides: Partial<EnemyData> = {}): EnemyData => Object.assign(new EnemyData(), {
    ID: 4,
    EnemyType: BaseEnemyType.Melee,
    Health: 8,
    Height: 64,
    Width: 48,
    StartPosition: { X: 2, Y: 3 }
  }, overrides);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemyCardComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EnemyCardComponent);
    component = fixture.componentInstance;
    component.enemy = createEnemy();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders enemy details and the enemy type name', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Enemy 4');
    expect(content).toContain('Melee');
    expect(content).toContain('Health: 8');
    expect(content).toContain('Size: 48 x 64');
    expect(content).toContain('Start Position: (2, 3)');
  });

  it('initializes an option for every enemy type', () => {
    expect(component.getEnemyTypeOptions()).toEqual([
      { value: BaseEnemyType.Grunt, name: 'Grunt' },
      { value: BaseEnemyType.Cannon, name: 'Cannon' },
      { value: BaseEnemyType.Melee, name: 'Melee' },
      { value: BaseEnemyType.Ship, name: 'Ship' },
      { value: BaseEnemyType.Boss, name: 'Boss' }
    ]);
    expect(component.getEnemyTypeName(999)).toBe('Unknown');
  });

  it('opens an editable deep copy without mutating the input', () => {
    component.toggleEdit();
    component.editableEnemy.Health = 12;
    component.editableEnemy.StartPosition.X = 7;

    expect(component.isEditing).toBe(true);
    expect(component.editableEnemy.Health).toBe(12);
    expect(component.editableEnemy.StartPosition).toEqual({ X: 7, Y: 3 });
    expect(component.enemy.Health).toBe(8);
    expect(component.enemy.StartPosition).toEqual({ X: 2, Y: 3 });
  });

  it('dispatches the edited enemy and closes the editor', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.toggleEdit();
    component.editableEnemy = createEnemy({ Health: 10 });

    component.saveChanges();

    expect(dispatch).toHaveBeenCalledWith(updateEnemy({ enemy: component.editableEnemy }));
    expect(component.isEditing).toBe(false);
  });

  it('discards edits when cancelled', () => {
    component.toggleEdit();
    component.editableEnemy.Health = 1;
    component.editableEnemy.StartPosition.Y = 9;

    component.cancelEdit();

    expect(component.isEditing).toBe(false);
    expect(component.editableEnemy).toEqual(component.enemy);
    expect(component.editableEnemy).not.toBe(component.enemy);
    expect(component.editableEnemy.StartPosition).not.toBe(component.enemy.StartPosition);
  });

  it('deletes a confirmed enemy', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => true));

    component.deleteEnemy();

    expect(dispatch).toHaveBeenCalledWith(deleteEnemy({ enemyId: 4 }));
  });

  it('does not delete when confirmation is declined', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => false));

    component.deleteEnemy();

    expect(dispatch).not.toHaveBeenCalled();
  });
});