import { Component, inject, Input } from '@angular/core';
import { BaseEnemyType, EnemyData } from '../../../models/level.model';
import { Store } from '@ngrx/store';
import { deleteEnemy, updateEnemy } from '../../../store/level.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-enemy-card',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './enemy-card.component.html',
  styleUrls: ['./enemy-card.component.scss']
})
export class EnemyCardComponent {
  @Input() enemy!: EnemyData;

  private store = inject(Store);
  isEditing = false;
  editableEnemy!: EnemyData;

  // Cache the BaseEnemyType to avoid recalculation
  enemyTypeOptions: Array<{ value: number; name: string }> = [];  

  ngOnInit(): void {
    this.resetEditableEnemy();
    this.initializeEnemyTypeOptions();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetEditableEnemy();
    }
  }

  saveChanges(): void {
    this.store.dispatch(updateEnemy({ enemy: this.editableEnemy }));
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetEditableEnemy();
  }

  deleteEnemy(): void {
    if (confirm(`Are you sure you want to delete enemy ${this.enemy.ID}?`)) {
      this.store.dispatch(deleteEnemy({ enemyId: this.enemy.ID }));
    }
  }

  getEnemyTypeName(enemyTyle: number) : string {
    return BaseEnemyType[enemyTyle] || 'Unknown';
  }

  getEnemyTypeOptions(): Array<{ value: number; name: string }> {
    return this.enemyTypeOptions;
  }

  resetEditableEnemy(): void {
    if (this.enemy) {
      this.editableEnemy = {
        ...this.enemy,
        StartPosition: { ...this.enemy.StartPosition }
      };
    }
  }

  private initializeEnemyTypeOptions(): void {
    this.enemyTypeOptions = Object.entries(BaseEnemyType)
      .filter(([key, value]) => typeof value === 'number')
      .map(([key, value]) => ({
        value: value as number,
        name: key
      }));
  }
}
