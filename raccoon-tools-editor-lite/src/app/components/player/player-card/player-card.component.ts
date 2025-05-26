import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { PlayerData } from '../../../models/level.model';
import { updatePlayer } from '../../../store/level.actions';

@Component({
  selector: 'app-player-card',
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
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss'
})
export class PlayerCardComponent {
  @Input() player!: PlayerData;
  
  private store = inject(Store);
  isEditing = false;
  editablePlayer!: PlayerData;

  ngOnInit(): void {
    this.resetEditablePlayer();
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
    this.editablePlayer = { ...this.player };
    // Copy the StartPosition object separately to avoid reference issues
    this.editablePlayer.StartPosition = { ...this.player.StartPosition };
  }

  saveChanges(): void {
    this.store.dispatch(updatePlayer({ player: this.editablePlayer }));
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetEditablePlayer();
  }

  private resetEditablePlayer(): void {
    this.editablePlayer = { ...this.player };
    if (this.player?.StartPosition) {
      this.editablePlayer.StartPosition = { ...this.player.StartPosition };
    }
  }
}
