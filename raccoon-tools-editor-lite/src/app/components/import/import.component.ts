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
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
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
    level.ID = data.ID || 0;    
    level.GridWidth = data.GridWidth || 0;
    level.GridHeight = data.GridHeight || 0;
    level.CellSize = data.CellSize || 0;
    level.LevelType = data.LevelType || 0;
    level.LevelDescription = data.LevelDescription || '';
    level.NumberOfTurns = data.NumberOfTurns || 0;
    
    // Map win position
    if (data.WinPosition) {
      level.WinPosition.X = data.WinPosition.X || 0;
      level.WinPosition.Y = data.WinPosition.Y || 0;
    }

    // Map arrays
    level.Players = (data.Players || []).map((p: any) => {
      const player = new PlayerData();
      player.ID = p.ID || 0;
      player.PlayerType = p.PlayerType || 0;
      player.Health = p.Health || 0;
      player.Height = p.Height || 0;
      player.Width = p.Width || 0;
      if (p.StartPosition) {
        player.StartPosition.X = p.StartPosition.X || 0;
        player.StartPosition.Y = p.StartPosition.Y || 0;
      }
      return player;
    });

    level.Enemies = (data.Enemies || []).map((e: any) => {
      const enemy = new EnemyData();
      enemy.ID = e.ID || 0;
      enemy.EnemyType = e.EnemyType || 0;
      enemy.Health = e.Health || 0;
      enemy.Height = e.Height || 0;
      enemy.Width = e.Width || 0;
      if (e.StartPosition) {
        enemy.StartPosition.X = e.StartPosition.X || 0;
        enemy.StartPosition.Y = e.StartPosition.Y || 0;
      }
      return enemy;
    });

    level.Obstacles = (data.Obstacles || []).map((o: any) => {
      const obstacle = new ObstacleData();
      obstacle.ID = o.ID || 0;
      obstacle.Health = o.Health || 0;
      obstacle.Height = o.Height || 0;
      obstacle.Width = o.Width || 0;
      obstacle.ObstacleType = o.ObstacleType || 0;
      obstacle.IsWalkable = o.IsWalkable || false;
      if (o.Position) {
        obstacle.Position.X = o.Position.X || 0;
        obstacle.Position.Y = o.Position.Y || 0;
      }
      return obstacle;
    });
    
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
