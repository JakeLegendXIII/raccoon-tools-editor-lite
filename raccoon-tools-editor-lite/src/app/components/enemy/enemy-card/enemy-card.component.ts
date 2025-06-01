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

@Component({
  selector: 'app-enemy-card',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './enemy-card.component.html',
  standalone: true,
  styleUrl: './enemy-card.component.scss'
})
export class EnemyCardComponent {
  @Input() enemy!: EnemyData;

  private store = inject(Store);
  isEditing = false;
  editableEnemy!: EnemyData;

  BaseEnemyType = BaseEnemyType;

  ngOnInit(): void {
    this.resetEditableEnemy();
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.cancelEdit();
    } else {
      this.startEdit();
    }
  }

  startEdit(): void {
    this.isEditing = true;
    this.editableEnemy = { ...this.enemy };
    // Copy the StartPosition object separately to avoid reference issues
    this.editableEnemy.StartPosition = { ...this.enemy.StartPosition };
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

  private resetEditableEnemy(): void {
    this.editableEnemy = { ...this.enemy };
    if (this.enemy?.StartPosition) {
      this.editableEnemy.StartPosition = { ...this.enemy.StartPosition };
    }    
  }
}
