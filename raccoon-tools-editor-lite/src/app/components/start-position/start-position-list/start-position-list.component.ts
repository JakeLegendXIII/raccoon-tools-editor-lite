import { Component } from '@angular/core';
import { Observable, take, combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LevelPoint } from '../../../models/level.model';
import { selectStartPositions, selectCurrentLevel } from '../../../store/level.selectors';
import { addStartPosition } from '../../../store/level.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StartPositionCardComponent } from '../start-position-card/start-position-card.component';
import { VisualizerComponent } from '../../visualizer/visualizer.component';

@Component({
  selector: 'app-start-position-list',
  imports: [
    StartPositionCardComponent, 
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    VisualizerComponent
  ],
  templateUrl: './start-position-list.component.html',
  styleUrls: ['./start-position-list.component.scss']
})
export class StartPositionListComponent {  
  startPositions$: Observable<LevelPoint[]>;

  constructor(private store: Store) {
    this.startPositions$ = this.store.select(selectStartPositions);
  }

  addNewStartPosition(): void {
    // Combine all entity positions to find available spots
    combineLatest([
      this.store.select(selectCurrentLevel)
    ]).pipe(take(1)).subscribe(([level]) => {
      const newStartPosition = new LevelPoint();
      let players = level?.Players || [];
      let enemies = level?.Enemies || [];  
      let obstacles = level?.Obstacles || [];
      let startPositions = level?.StartPositionsList || [];
      
      // Find random available position
      const availablePosition = this.findRandomAvailablePosition(
        level?.GridWidth ?? 0,
        level?.GridHeight ?? 0,
        players,
        enemies,
        obstacles,
        startPositions
      );
      newStartPosition.X = availablePosition.x;
      newStartPosition.Y = availablePosition.y;
      
      this.store.dispatch(addStartPosition({ startPosition: newStartPosition }));
    });
  }
  
  private findRandomAvailablePosition(gridWidth: number, gridHeight: number, players: any[], enemies: any[], obstacles: any[], startPositions: LevelPoint[]): { x: number, y: number } {
    const GRID_WIDTH = gridWidth;
    const GRID_HEIGHT = gridHeight;
    
    // Collect all occupied positions
    const occupiedPositions = new Set<string>();
    
    // Add entity positions
    [...players, ...enemies, ...obstacles].forEach(entity => {
      if (entity.StartPosition) {
        occupiedPositions.add(`${entity.StartPosition.X},${entity.StartPosition.Y}`);
      } else if (entity.Position) {
        occupiedPositions.add(`${entity.Position.X},${entity.Position.Y}`);
      }
    });

    // Add existing start positions
    startPositions.forEach(pos => {
      occupiedPositions.add(`${pos.X},${pos.Y}`);
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
