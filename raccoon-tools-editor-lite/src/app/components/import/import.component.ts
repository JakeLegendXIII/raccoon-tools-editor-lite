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
    level.id = data.ID || 0;
    level.numberOfPlayers = data.NumberOfPlayers || 0;
    level.numberOfEnemies = data.NumberOfEnemies || 0;
    level.gridWidth = data.GridWidth || 0;
    level.gridHeight = data.GridHeight || 0;
    level.cellSize = data.CellSize || 0;
    level.levelType = data.LevelType || 0;
    level.levelDescription = data.LevelDescription || '';
    level.numberOfTurns = data.NumberOfTurns || 0;
    
    // Map win position
    if (data.WinPosition) {
      level.winPosition.x = data.WinPosition.x || 0;
      level.winPosition.y = data.WinPosition.y || 0;
    }

    // Map arrays
    level.players = (data.Players || []).map((p: any) => {
      const player = new PlayerData();
      player.id = p.ID || 0;
      player.playerType = p.PlayerType || 0;
      player.health = p.Health || 0;
      player.height = p.Height || 0;
      player.width = p.Width || 0;
      if (p.StartPosition) {
        player.startPosition.x = p.StartPosition.x || 0;
        player.startPosition.y = p.StartPosition.y || 0;
      }
      return player;
    });

    level.enemies = (data.Enemies || []).map((e: any) => {
      const enemy = new EnemyData();
      enemy.id = e.ID || 0;
      enemy.enemyType = e.EnemyType || 0;
      enemy.health = e.Health || 0;
      enemy.height = e.Height || 0;
      enemy.width = e.Width || 0;
      if (e.StartPosition) {
        enemy.startPosition.x = e.StartPosition.x || 0;
        enemy.startPosition.y = e.StartPosition.y || 0;
      }
      return enemy;
    });

    level.obstacles = (data.Obstacles || []).map((o: any) => {
      const obstacle = new ObstacleData();
      obstacle.id = o.ID || 0;
      obstacle.health = o.Health || 0;
      obstacle.height = o.Height || 0;
      obstacle.width = o.Width || 0;
      obstacle.obstacleType = o.ObstacleType || 0;
      obstacle.isWalkable = o.IsWalkable || false;
      if (o.Position) {
        obstacle.position.x = o.Position.x || 0;
        obstacle.position.y = o.Position.y || 0;
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
