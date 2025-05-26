import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Level, LevelPoint, PlayerData, EnemyData, ObstacleData } from '../../models/level.model';
import { loadLevel } from '../../store/level.actions';

@Component({
  selector: 'app-import',
  imports: [
    CommonModule,
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule
  ],
  standalone: true,
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent {
  private dialogRef = inject(MatDialogRef<ImportComponent>);
  private store = inject(Store);

  selectedFile: File | null = null;
  fileContent: string = '';
  isValidJson: boolean = false;
  errorMessage: string = '';

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      this.selectedFile = file;
      this.readFile(file);
    } else {
      this.errorMessage = 'Please select a valid JSON file';
      this.selectedFile = null;
      this.isValidJson = false;
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.fileContent = e.target?.result as string;
        const parsed = JSON.parse(this.fileContent);
        this.validateLevelData(parsed);
      } catch (error) {
        this.errorMessage = 'Invalid JSON format';
        this.isValidJson = false;
      }
    };
    reader.readAsText(file);
  }

  private validateLevelData(data: any): boolean {
    try {
      // Basic validation - check if it has level properties
      if (typeof data === 'object' && data !== null) {
        this.isValidJson = true;
        this.errorMessage = '';
        return true;
      }
    } catch (error) {
      this.errorMessage = 'Invalid level data format';
      this.isValidJson = false;
    }
    return false;
  }

  private deserializeLevel(data: any): Level {
    const level = new Level();
    
    // Map basic properties
    level.id = data.id || 0;
    level.numberOfPlayers = data.numberOfPlayers || 0;
    level.numberOfEnemies = data.numberOfEnemies || 0;
    level.gridWidth = data.gridWidth || 0;
    level.gridHeight = data.gridHeight || 0;
    level.cellSize = data.cellSize || 0;
    level.levelType = data.levelType || 0;
    level.levelDescription = data.levelDescription || '';
    level.numberOfTurns = data.numberOfTurns || 0;
    
    // Map win position
    if (data.winPosition) {
      level.winPosition.x = data.winPosition.x || 0;
      level.winPosition.y = data.winPosition.y || 0;
    }

    // Map arrays
    level.players = (data.players || []).map((p: any) => {
      const player = new PlayerData();
      player.id = p.id || 0;
      player.playerType = p.playerType || 0;
      player.health = p.health || 0;
      player.height = p.height || 0;
      player.width = p.width || 0;
      if (p.startPosition) {
        player.startPosition.x = p.startPosition.x || 0;
        player.startPosition.y = p.startPosition.y || 0;
      }
      return player;
    });

    level.enemies = (data.enemies || []).map((e: any) => {
      const enemy = new EnemyData();
      enemy.id = e.id || 0;
      enemy.enemyType = e.enemyType || 0;
      enemy.health = e.health || 0;
      enemy.height = e.height || 0;
      enemy.width = e.width || 0;
      if (e.startPosition) {
        enemy.startPosition.x = e.startPosition.x || 0;
        enemy.startPosition.y = e.startPosition.y || 0;
      }
      return enemy;
    });

    level.obstacles = (data.obstacles || []).map((o: any) => {
      const obstacle = new ObstacleData();
      obstacle.id = o.id || 0;
      obstacle.health = o.health || 0;
      obstacle.height = o.height || 0;
      obstacle.width = o.width || 0;
      obstacle.obstacleType = o.obstacleType || 0;
      obstacle.isWalkable = o.isWalkable || false;
      if (o.position) {
        obstacle.position.x = o.position.x || 0;
        obstacle.position.y = o.position.y || 0;
      }
      return obstacle;
    });

    console.log('Deserialized Level:', level);
    return level;
  }

  onImport(): void {
    if (this.isValidJson && this.fileContent) {
      try {
        const levelData = JSON.parse(this.fileContent);
        const level = this.deserializeLevel(levelData);
        this.store.dispatch(loadLevel({ level }));
        this.dialogRef.close(level);
      } catch (error) {
        this.errorMessage = 'Failed to import level data';
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
