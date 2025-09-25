import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { LevelPoint } from '../../../models/level.model';
import { updateStartPosition, deleteStartPosition } from '../../../store/level.actions';

@Component({
  selector: 'app-start-position-card',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './start-position-card.component.html',
  styleUrls: ['./start-position-card.component.scss']
})
export class StartPositionCardComponent implements OnInit {
  @Input() startPosition!: LevelPoint;
  @Input() index!: number;
  
  private store = inject(Store);
  isEditing = false;
  editableStartPosition!: LevelPoint;

  ngOnInit(): void {
    this.resetEditableStartPosition();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetEditableStartPosition();
    }
  }

  resetEditableStartPosition(): void {
    if (this.startPosition) {
      this.editableStartPosition = {
        ...this.startPosition
      };
    }
  }

  saveChanges(): void {
    this.store.dispatch(updateStartPosition({ 
      index: this.index, 
      startPosition: this.editableStartPosition 
    }));
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetEditableStartPosition();
  }

  deleteStartPosition(): void {
    if (confirm('Are you sure you want to delete this start position?')) {
      this.store.dispatch(deleteStartPosition({ index: this.index }));
    }
  }
}
