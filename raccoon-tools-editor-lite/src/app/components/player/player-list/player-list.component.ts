import { Component, inject } from '@angular/core';
import { PlayerCardComponent } from "../player-card/player-card.component";
import { Observable, take, combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PlayerData } from '../../../models/level.model';
import { selectPlayers, selectCurrentLevel } from '../../../store/level.selectors';
import { addPlayer } from '../../../store/level.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VisualizerComponent } from '../../visualizer/visualizer.component';

@Component({
  selector: 'app-player-list',
  imports: [
    PlayerCardComponent, 
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    VisualizerComponent
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  private store = inject(Store);

  players$: Observable<PlayerData[]>;

  constructor() {
    this.players$ = this.store.select(selectPlayers);
  }  
  
  addNewPlayer(): void {
    // Combine all entity positions to find available spots
    combineLatest([
      this.store.select(selectCurrentLevel)
    ]).pipe(take(1)).subscribe(([level]) => {
      const newPlayer = new PlayerData();
      let players = level?.Players || [];
      let enemies = level?.Enemies || [];  
      let obstacles = level?.Obstacles || [];
      // Generate ID as largest existing ID plus one
      const maxId = players.length > 0 ? Math.max(...players.map(p => p.ID)) : 0;
      newPlayer.ID = maxId + 1;
      newPlayer.PlayerType = 0;
      newPlayer.Health = 3;
      newPlayer.Height = 64;
      newPlayer.Width = 64;
      
      // Find random available position
      const availablePosition = this.findRandomAvailablePosition(
        level?.GridWidth ?? 0,
        level?.GridHeight ?? 0,
        players,
        enemies,
        obstacles
      );
      newPlayer.StartPosition.X = availablePosition.x;
      newPlayer.StartPosition.Y = availablePosition.y;
      
      this.store.dispatch(addPlayer({ player: newPlayer }));
    });
  }
  
  private findRandomAvailablePosition(gridWidth: number, gridHeight: number, players: any[], enemies: any[], obstacles: any[]): { x: number, y: number } {
    const GRID_WIDTH = gridWidth;
    const GRID_HEIGHT = gridHeight;
    
    // Collect all occupied positions
    const occupiedPositions = new Set<string>();
    
    [...players, ...enemies, ...obstacles].forEach(entity => {
      if (entity.StartPositionX !== undefined && entity.StartPositionY !== undefined) {
        occupiedPositions.add(`${entity.StartPositionX},${entity.StartPositionY}`);
      }
    });
    
    // Find available positions
    const availablePositions: { x: number, y: number }[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        if (!occupiedPositions.has(`${x},${y}`)) {
          availablePositions.push({ x, y });
        }
      }
    }
    
    // Return random available position or default if none available
    if (availablePositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      return availablePositions[randomIndex];
    } else {
      // Fallback to random position if grid is full
      return {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
    }
  }
}
