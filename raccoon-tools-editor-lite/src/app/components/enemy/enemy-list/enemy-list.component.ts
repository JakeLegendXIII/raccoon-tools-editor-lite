import { Component } from '@angular/core';
import { EnemyData } from '../../../models/level.model';
import { combineLatest, Observable, take } from 'rxjs';
import { EnemyCardComponent } from '../enemy-card/enemy-card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectCurrentLevel, selectEnemies } from '../../../store/level.selectors';
import { addEnemy } from '../../../store/level.actions';
import { VisualizerComponent } from "../../visualizer/visualizer.component";

@Component({
  selector: 'app-enemy-list',
  imports: [
    EnemyCardComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VisualizerComponent
],
  templateUrl: './enemy-list.component.html',
  styleUrls: ['./enemy-list.component.scss']
})
export class EnemyListComponent {
  enemies$: Observable<EnemyData[]>;
  
constructor(private store: Store) {
    this.enemies$ = this.store.select(selectEnemies);
  }  
  
  addNewEnemy(): void {
    // Combine all entity positions to find available spots
    combineLatest([
      this.store.select(selectCurrentLevel)
    ]).pipe(take(1)).subscribe(([level]) => {
      const newEnemy = new EnemyData();
      let players = level?.Players || [];
      let enemies = level?.Enemies || [];  
      let obstacles = level?.Obstacles || [];
      // Generate ID as largest existing ID plus one
      const maxId = enemies.length > 0 ? Math.max(...enemies.map(p => p.ID)) : 0;
      newEnemy.ID = maxId + 1;
      newEnemy.EnemyType = 0;
      newEnemy.Health = 3;
      newEnemy.Height = 64;
      newEnemy.Width = 64;
      
      // Find random available position
      const availablePosition = this.findRandomAvailablePosition(
        level?.GridWidth ?? 0,
        level?.GridHeight ?? 0,
        players,
        enemies,
        obstacles
      );
      newEnemy.StartPosition.X = availablePosition.x;
      newEnemy.StartPosition.Y = availablePosition.y;
      
      this.store.dispatch(addEnemy({ enemy: newEnemy }));
    });
  }
  private findRandomAvailablePosition(gridWidth: number, gridHeight: number, enemys: any[], enemies: any[], obstacles: any[]): { x: number, y: number } {
    const GRID_WIDTH = gridWidth;
    const GRID_HEIGHT = gridHeight;
    
    // Collect all occupied positions
    const occupiedPositions = new Set<string>();
    
    [...enemys, ...enemies, ...obstacles].forEach(entity => {
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

