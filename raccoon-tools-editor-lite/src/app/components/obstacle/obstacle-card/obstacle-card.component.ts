import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObstacleData, ObstacleType } from '../../../models/level.model';
import { deleteObstacle, updateObstacle } from '../../../store/level.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-obstacle-card',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  standalone: true,
  templateUrl: './obstacle-card.component.html',
  styleUrl: './obstacle-card.component.scss'
})
export class ObstacleCardComponent {
  @Input() obstacle!: ObstacleData;

  private store = inject(Store);
  isEditing = false;
  editableObstacle!: ObstacleData;

  ObstacleType = ObstacleType;

  ngOnInit(): void {
    this.resetEditableObstacle();
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
    this.editableObstacle = { ...this.obstacle };
    // Copy the StartPosition object separately to avoid reference issues
    this.editableObstacle.Position = { ...this.obstacle.Position };
  }

  saveChanges(): void {
    this.store.dispatch(updateObstacle({ obstacle: this.editableObstacle }));
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetEditableObstacle();
  }

  deleteObstacle() : void {
    if (confirm('Are you sure you want to delete this obstacle?')) {
      this.store.dispatch(deleteObstacle({ obstacleId: this.obstacle.ID }));
    }
  }

  resetEditableObstacle(): void {
    this.editableObstacle = { ...this.obstacle };
    // Ensure StartPosition is a new object to avoid reference issues
    this.editableObstacle.Position = { ...this.obstacle.Position };
  }

  getObstacleTypeName(obstacleType: number): string {
    return ObstacleType[obstacleType] || 'Unknown';
  }
}
