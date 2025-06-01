import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { BasePlayerType, PlayerData } from '../../../models/level.model';
import { updatePlayer, deletePlayer } from '../../../store/level.actions';

@Component({
  selector: 'app-player-card',
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
  standalone: true,
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss'
})
export class PlayerCardComponent implements OnInit {
  @Input() player!: PlayerData;
  
  private store = inject(Store);
  isEditing = false;
  editablePlayer!: PlayerData;

  // Cache the player type options to avoid recalculation
  playerTypeOptions: Array<{ value: number; name: string }> = [];

  ngOnInit(): void {
    this.resetEditablePlayer();
    this.initializePlayerTypeOptions();
  }

  private initializePlayerTypeOptions(): void {
    this.playerTypeOptions = Object.entries(BasePlayerType)
      .filter(([key, value]) => typeof value === 'number')
      .map(([key, value]) => ({
        value: value as number,
        name: key
      }));
  }

  getPlayerTypeName(playerType: number): string {
    return BasePlayerType[playerType] || 'Unknown';
  }

  getPlayerTypeOptions(): Array<{ value: number; name: string }> {
    return this.playerTypeOptions;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetEditablePlayer();
    }
  }

  resetEditablePlayer(): void {
    if (this.player) {
      this.editablePlayer = {
        ...this.player,
        StartPosition: { ...this.player.StartPosition }
      };
    }
  }

  saveChanges(): void {
    this.store.dispatch(updatePlayer({ player: this.editablePlayer }));
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetEditablePlayer();
  }

  deletePlayer(): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.store.dispatch(deletePlayer({ playerId: this.player.ID }));
    }
  }
}
