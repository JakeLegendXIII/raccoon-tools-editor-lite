import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Level, PlayerData, EnemyData, ObstacleData, LevelPoint } from '../../models/level.model';
import { selectCurrentLevel } from '../../store/level.selectors';

interface GridCell {
  x: number;
  y: number;
  player?: PlayerData;
  enemy?: EnemyData;
  obstacle?: ObstacleData;
}

@Component({
  selector: 'app-visualizer',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './visualizer.component.html',
  styleUrl: './visualizer.component.scss'
})
export class VisualizerComponent implements OnInit {
  currentLevel$: Observable<Level | null>;
  gridCells: GridCell[][] = [];
  level: Level | null = null;

  constructor(private store: Store) {
    this.currentLevel$ = this.store.select(selectCurrentLevel);
  }

  ngOnInit() {
    this.currentLevel$.subscribe(level => {
      this.level = level;
      if (level) {
        this.generateGrid(level);
      }
    });
  }
  private generateGrid(level: Level) {
    const width = level.GridWidth || 8;
    const height = level.GridHeight || 8;
    
    // Initialize empty grid
    this.gridCells = [];
    for (let y = 0; y < height; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < width; x++) {
        row.push({ x, y });
      }
      this.gridCells.push(row);
    }

    // Place players
    level.Players.forEach(player => {
      const x = player.StartPosition.X;
      const y = player.StartPosition.Y;
      if (this.isValidPosition(x, y, width, height)) {
        this.gridCells[y][x].player = player;
      }
    });

    // Place enemies
    level.Enemies.forEach(enemy => {
      const x = enemy.StartPosition.X;
      const y = enemy.StartPosition.Y;
      if (this.isValidPosition(x, y, width, height)) {
        this.gridCells[y][x].enemy = enemy;
      }
    });

    // Place obstacles
    level.Obstacles.forEach(obstacle => {
      const x = obstacle.Position.X;
      const y = obstacle.Position.Y;
      if (this.isValidPosition(x, y, width, height)) {
        this.gridCells[y][x].obstacle = obstacle;
      }
    });
  }

  private isValidPosition(x: number, y: number, width: number, height: number): boolean {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  getCellClass(cell: GridCell): string {
    if (cell.player) return 'cell-player';
    if (cell.enemy) return 'cell-enemy';
    if (cell.obstacle) return 'cell-obstacle';
    return 'cell-empty';
  }
  getCellContent(cell: GridCell): string {
    if (cell.player) {
      return `P${cell.player.ID}\nT${cell.player.PlayerType}`;
    }
    if (cell.enemy) {
      return `E${cell.enemy.ID}\nT${cell.enemy.EnemyType}`;
    }
    if (cell.obstacle) {
      return `O${cell.obstacle.ID}\nT${cell.obstacle.ObstacleType}`;
    }
    return '';
  }

  getXAxisLabels(): number[] {
    if (!this.level) return [];
    return Array.from({length: this.level.GridWidth || 8}, (_, i) => i);
  }

  getYAxisLabels(): number[] {
    if (!this.level) return [];
    return Array.from({length: this.level.GridHeight || 8}, (_, i) => i);
  }
}
