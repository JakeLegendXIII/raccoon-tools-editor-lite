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
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-obstacle-card',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  MatSelectModule,
  MatCheckboxModule
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

  // Cache the ObstacleType to avoid recalculation
  obstacleTypeOptions: Array<{ value: number; name: string }> = [];

  ngOnInit(): void {
    this.resetEditableObstacle();
    this.initializeObstacleTypeOptions();
  }

  toggleEdit(): void {
   this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetEditableObstacle();
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

  getObstacleTypeName(obstacleType: number): string {
    return ObstacleType[obstacleType] || 'Unknown';
  }

  getObstacleTypeOptions(): Array<{ value: number; name: string }> {
    return this.obstacleTypeOptions;
  }

    resetEditableObstacle(): void {
    if (this.obstacle) {
      this.editableObstacle = {
        ...this.obstacle,
        Position: { ...this.obstacle.Position }
      };
      // Ensure defaults are applied if values are undefined (legacy data)
      if (this.editableObstacle.IsWalkable === undefined || this.editableObstacle.IsDestructible === undefined) {
        this.applyTypeDefaults(this.editableObstacle.ObstacleType, this.editableObstacle);
      }
    }
  }

  private initializeObstacleTypeOptions(): void {
    this.obstacleTypeOptions = Object.entries(ObstacleType)
      .filter(([key, value]) => typeof value === 'number')
      .map(([key, value]) => ({
        value: value as number,
        name: key
      }));
  }

  onObstacleTypeChange(): void {
    // Reapply defaults when type changes
    this.applyTypeDefaults(this.editableObstacle.ObstacleType, this.editableObstacle);
  }

  private applyTypeDefaults(type: number, target: ObstacleData): void {
    switch (type) {
      case ObstacleType.Mountain:
        target.IsWalkable = false;
        target.IsDestructible = false;
        break;
      case ObstacleType.Water:
        target.IsWalkable = true;
        target.IsDestructible = false;
        break;
      default:
        // Leave existing values for other types if already set; otherwise set safe defaults
        if (target.IsWalkable === undefined) target.IsWalkable = false;
        if (target.IsDestructible === undefined) target.IsDestructible = false;
        break;
    }
  }
}
