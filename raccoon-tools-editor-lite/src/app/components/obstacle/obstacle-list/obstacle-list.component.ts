import { Component } from '@angular/core';
import { selectCurrentLevel, selectObstacles } from '../../../store/level.selectors';
import { combineLatest, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { ObstacleData } from '../../../models/level.model';
import { addObstacle } from '../../../store/level.actions';
import { ObstacleCardComponent } from '../obstacle-card/obstacle-card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VisualizerComponent } from "../../visualizer/visualizer.component";

@Component({
  selector: 'app-obstacle-list',
  imports: [
    ObstacleCardComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VisualizerComponent
],
  templateUrl: './obstacle-list.component.html',
  styleUrls: ['./obstacle-list.component.scss']
})
export class ObstacleListComponent {
  obstacles$: Observable<ObstacleData[]>;

  constructor(private store: Store) {
    this.obstacles$ = this.store.select(selectObstacles);
  }

  addNewObstacle(): void {
      // Combine all entity positions to find available spots
      combineLatest([
        this.store.select(selectCurrentLevel)
      ]).pipe(take(1)).subscribe(([level]) => {
        const newObstacle = new ObstacleData();
        let players = level?.Players || [];
        let enemies = level?.Enemies || [];  
        let obstacles = level?.Obstacles || [];
        // Generate ID as largest existing ID plus one
        const maxId = obstacles.length > 0 ? Math.max(...obstacles.map(p => p.ID)) : 0;
        newObstacle.ID = maxId + 1;
        newObstacle.ObstacleType = 0;
        newObstacle.Health = 3;
        newObstacle.Height = 64;
        newObstacle.Width = 64;
        newObstacle.IsWalkable = false;
        newObstacle.IsDestructible = true;

        // Find random available position
        const availablePosition = this.findRandomAvailablePosition(
          level?.GridWidth ?? 0,
          level?.GridHeight ?? 0,
          players,
          enemies,
          obstacles
        );
        newObstacle.Position.X = availablePosition.x;
        newObstacle.Position.Y = availablePosition.y;
        
        this.store.dispatch(addObstacle({ obstacle: newObstacle }));
      });
    }

  private findRandomAvailablePosition(gridWidth: number, gridHeight: number, players: any[], enemies: any[], obstacles: any[]): { x: number, y: number } {
    const GRID_WIDTH = gridWidth;
    const GRID_HEIGHT = gridHeight;
    
    // Collect all occupied positions
    const occupiedPositions = new Set<string>();
    
    // Add player positions
    players.forEach(player => {
      if (player.StartPosition) {
        occupiedPositions.add(`${player.StartPosition.X},${player.StartPosition.Y}`);
      }
    });

    // Add enemy positions
    enemies.forEach(enemy => {
      if (enemy.StartPosition) {
        occupiedPositions.add(`${enemy.StartPosition.X},${enemy.StartPosition.Y}`);
      }
    });

    // Add obstacle positions
    obstacles.forEach(obstacle => {
      if (obstacle.Position) {
        occupiedPositions.add(`${obstacle.Position.X},${obstacle.Position.Y}`);
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
