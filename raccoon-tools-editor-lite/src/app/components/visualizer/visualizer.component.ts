import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Level, PlayerData, EnemyData, ObstacleData, LevelPoint, BasePlayerType, BaseEnemyType, ObstacleType, LevelType } from '../../models/level.model';
import { selectCurrentLevel } from '../../store/level.selectors';
import { updatePlayer, updateEnemy, updateObstacle, updateWinPosition, updateStartPosition } from '../../store/level.actions';

interface GridCell {
  x: number;
  y: number;
  player?: PlayerData;
  enemy?: EnemyData;
  obstacle?: ObstacleData;
  winPosition?: LevelPoint;
  startPosition?: boolean;
  startPositionIndex?: number; // Index in the StartPositionsList array
}

interface DragData {
  type: 'player' | 'enemy' | 'obstacle' | 'winPosition' | 'startPosition';
  data: PlayerData | EnemyData | ObstacleData | LevelPoint;
  sourceX: number;
  sourceY: number;
  startPositionIndex?: number; // For tracking which start position is being dragged
}

@Component({
  selector: 'app-visualizer',
  imports: [CommonModule],
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit {
  private store = inject(Store);

  currentLevel$: Observable<Level | null>;
  gridCells: GridCell[][] = [];
  level: Level | null = null;
  dragData: DragData | null = null;
  dragOverCell: GridCell | null = null;
  dragMessage: string = '';

  LevelType = LevelType;
  BasePlayerType = BasePlayerType;
  BaseEnemyType = BaseEnemyType;
  ObstacleType = ObstacleType;

  constructor() {
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

    // Place start positions (these go first to appear underneath other entities)
    if (level.StartPositionsList) {
      level.StartPositionsList.forEach((startPos, index) => {
        const x = startPos.X;
        const y = startPos.Y;
        if (this.isValidPosition(x, y, width, height)) {
          this.gridCells[y][x].startPosition = true;
          this.gridCells[y][x].startPositionIndex = index;
        }
      });
    }

    if (level.LevelType === LevelType.Escape) {
      // Place win position for Escape levels
      const winX = level.WinPosition.X;
      const winY = level.WinPosition.Y;
      if (this.isValidPosition(winX, winY, width, height)) {
        this.gridCells[winY][winX].winPosition = level.WinPosition;        
      }
    }
  }

  private isValidPosition(x: number, y: number, width: number, height: number): boolean {
    return x >= 0 && x < width && y >= 0 && y < height;
  }
  
  getCellContent(cell: GridCell): string {
    if (cell.player) {
      return `P${cell.player.ID}\nT: ${this.getPlayerTypeName(cell.player.PlayerType)}`;
    }
    if (cell.enemy) {
      return `E${cell.enemy.ID}\nT: ${this.getEnemyTypeName(cell.enemy.EnemyType)}`;
    }
    if (cell.obstacle) {
      return `O${cell.obstacle.ID}\nT: ${this.getObstacleTypeName(cell.obstacle.ObstacleType)}`;
    }
    if (cell.winPosition) {
      return 'Win Position';
    }
    if (cell.startPosition && !cell.player && !cell.enemy && !cell.obstacle && !cell.winPosition) {
      return 'Start';
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
  getFlattenedCells(): GridCell[] {
    return this.gridCells.flat();
  }
  // Drag and Drop functionality
  onDragStart(event: DragEvent, cell: GridCell): void {
    if (cell.player) {
      this.dragData = {
        type: 'player',
        data: cell.player,
        sourceX: cell.x,
        sourceY: cell.y
      };
      this.dragMessage = `Dragging Player ${cell.player.ID} from (${cell.x}, ${cell.y})`;
    } else if (cell.enemy) {
      this.dragData = {
        type: 'enemy',
        data: cell.enemy,
        sourceX: cell.x,
        sourceY: cell.y
      };
      this.dragMessage = `Dragging Enemy ${cell.enemy.ID} from (${cell.x}, ${cell.y})`;
    } else if (cell.obstacle) {
      this.dragData = {
        type: 'obstacle',
        data: cell.obstacle,
        sourceX: cell.x,
        sourceY: cell.y
      };
      this.dragMessage = `Dragging Obstacle ${cell.obstacle.ID} from (${cell.x}, ${cell.y})`;
    } else if (cell.winPosition) {
      this.dragData = {
        type: 'winPosition',
        data: cell.winPosition,
        sourceX: cell.x,
        sourceY: cell.y
      };
      this.dragMessage = `Dragging Win Position from (${cell.x}, ${cell.y})`;
    } else if (cell.startPosition && cell.startPositionIndex !== undefined) {
      // Only drag start position if no other entity is on top
      const startPos = this.level?.StartPositionsList[cell.startPositionIndex];
      if (startPos) {
        this.dragData = {
          type: 'startPosition',
          data: startPos,
          sourceX: cell.x,
          sourceY: cell.y,
          startPositionIndex: cell.startPositionIndex
        };
        this.dragMessage = `Dragging Start Position ${cell.startPositionIndex + 1} from (${cell.x}, ${cell.y})`;
      }
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  }
  onDragOver(event: DragEvent, cell: GridCell): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverCell = cell;
  }

  onDragLeave(event: DragEvent): void {
    // Only clear if we're leaving the cell completely
    if (!event.relatedTarget || !(event.currentTarget as Element).contains(event.relatedTarget as Node)) {
      this.dragOverCell = null;
    }
  }
  onDrop(event: DragEvent, targetCell: GridCell): void {
    event.preventDefault();
    
    if (!this.dragData || !this.level) {
      this.dragMessage = '';
      return;
    }

    // Don't allow dropping regular entities on occupied cells (unless it's the same cell)
    // But allow start positions to be dropped anywhere
    if (this.dragData.type !== 'startPosition' && 
        (targetCell.player || targetCell.enemy || targetCell.obstacle) && 
        !(targetCell.x === this.dragData.sourceX && targetCell.y === this.dragData.sourceY)) {
      this.dragMessage = 'Cannot drop on occupied cell!';
      setTimeout(() => this.dragMessage = '', 2000);
      this.dragData = null;
      return;
    }

    // Don't do anything if dropped on the same cell
    if (targetCell.x === this.dragData.sourceX && targetCell.y === this.dragData.sourceY) {
      this.dragMessage = '';
      this.dragData = null;
      return;
    }

    // Update the position and dispatch the action
    const newPosition = new LevelPoint();
    newPosition.X = targetCell.x;
    newPosition.Y = targetCell.y;

    if (this.dragData.type === 'player') {
      const updatedPlayer = { ...this.dragData.data as PlayerData };
      updatedPlayer.StartPosition = newPosition;
      this.store.dispatch(updatePlayer({ player: updatedPlayer }));
      this.dragMessage = `Player ${updatedPlayer.ID} moved to (${targetCell.x}, ${targetCell.y})`;
    } else if (this.dragData.type === 'enemy') {
      const updatedEnemy = { ...this.dragData.data as EnemyData };
      updatedEnemy.StartPosition = newPosition;
      this.store.dispatch(updateEnemy({ enemy: updatedEnemy }));
      this.dragMessage = `Enemy ${updatedEnemy.ID} moved to (${targetCell.x}, ${targetCell.y})`;
    } else if (this.dragData.type === 'obstacle') {
      const updatedObstacle = { ...this.dragData.data as ObstacleData };
      updatedObstacle.Position = newPosition;
      this.store.dispatch(updateObstacle({ obstacle: updatedObstacle }));
      this.dragMessage = `Obstacle ${updatedObstacle.ID} moved to (${targetCell.x}, ${targetCell.y})`;
    } else if (this.dragData.type === 'winPosition') {
      const updatedWinPosition = { ...this.dragData.data as LevelPoint };
      updatedWinPosition.X = targetCell.x;
      updatedWinPosition.Y = targetCell.y;
      this.store.dispatch(updateWinPosition({ winPosition: updatedWinPosition }));
      this.dragMessage = `Win Position moved to (${targetCell.x}, ${targetCell.y})`;
    } else if (this.dragData.type === 'startPosition' && this.dragData.startPositionIndex !== undefined) {
      const updatedStartPosition = { ...this.dragData.data as LevelPoint };
      updatedStartPosition.X = targetCell.x;
      updatedStartPosition.Y = targetCell.y;
      this.store.dispatch(updateStartPosition({ 
        index: this.dragData.startPositionIndex, 
        startPosition: updatedStartPosition 
      }));
      this.dragMessage = `Start Position ${this.dragData.startPositionIndex + 1} moved to (${targetCell.x}, ${targetCell.y})`;
    }

    setTimeout(() => this.dragMessage = '', 3000);
    this.dragData = null;
  }  onDragEnd(): void {
    this.dragData = null;
    this.dragOverCell = null;
    if (this.dragMessage && !this.dragMessage.includes('moved to') && !this.dragMessage.includes('Cannot drop')) {
      this.dragMessage = '';
    }
  }

  isDraggable(cell: GridCell): boolean {
    // Prioritize dragging entities over start positions
    if (cell.player || cell.enemy || cell.obstacle || cell.winPosition) {
      return true;
    }
    // Only allow dragging start positions if no other entity is present
    return !!(cell.startPosition && cell.startPositionIndex !== undefined);
  }

  getDragCursor(cell: GridCell): string {
    return this.isDraggable(cell) ? 'grab' : 'default';
  }

  isDragOver(cell: GridCell): boolean {
    return this.dragOverCell === cell;
  }

  canDropOnCell(cell: GridCell): boolean {
    if (!this.dragData) return false;
    
    if (this.level?.LevelType === LevelType.Escape && cell.winPosition) {
      return false; // Cannot drop on win position in Escape levels
    }
    
    // Start positions can be dropped anywhere
    if (this.dragData.type === 'startPosition') {
      return true;
    }
    
    // Can always drop on empty cells
    if (!cell.player && !cell.enemy && !cell.obstacle) return true;
    
    // Can drop on the same cell (source cell)
    return cell.x === this.dragData.sourceX && cell.y === this.dragData.sourceY;
  }

  getLevelTypeName(levelType: number): string {
    return LevelType[levelType] || 'Unknown';
  }

  getPlayerTypeName(playerType: number): string {
    return BasePlayerType[playerType] || 'Unknown';
  }

  getEnemyTypeName(enemyType: number): string {
    return BaseEnemyType[enemyType] || 'Unknown';
  }

  getObstacleTypeName(obstacleType: number): string {
    return ObstacleType[obstacleType] || 'Unknown';
  }
}
