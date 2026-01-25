import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Level, LevelPoint, PlayerData, EnemyData, ObstacleData } from '../../models/level.model';
import { Item, ItemType } from '../../models/item.model';
import { loadLevel } from '../../store/level.actions';
import { loadItems } from '../../store/items.actions';

export type ImportType = 'level' | 'items';

@Component({
  selector: 'app-import',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule
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
  importType: ImportType = 'level';

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
      if (this.importType === 'items') {
        // Validate items array
        if (Array.isArray(data)) {
          this.isValidJson = true;
          this.errorMessage = '';
          return true;
        } else {
          this.errorMessage = 'Invalid items format: expected an array of items';
          this.isValidJson = false;
          return false;
        }
      } else {
        // Basic validation - check if it has level properties
        if (typeof data === 'object' && data !== null) {
          this.isValidJson = true;
          this.errorMessage = '';
          return true;
        }
      }
    } catch (error) {
      this.errorMessage = this.importType === 'items' ? 'Invalid items data format' : 'Invalid level data format';
      this.isValidJson = false;
    }
    return false;
  }

  onImportTypeChange(): void {
    // Reset file selection when import type changes
    this.selectedFile = null;
    this.fileContent = '';
    this.isValidJson = false;
    this.errorMessage = '';
  }

  private deserializeItems(data: any[]): Item[] {
    return data.map((i: any) => {
      const item = new Item();
      item.ID = i.ID || 0;
      item.Name = i.Name || '';
      item.Description = i.Description || '';      
      item.ChangeValue = i.ChangeValue || 0;      
      item.ItemType = i.ItemType ?? ItemType.Attack;
      item.UseCount = i.UseCount ?? 1;
      return item;
    });
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
      obstacle.IsDestructible = o.IsDestructible || false;
      if (o.Position) {
        obstacle.Position.X = o.Position.X || 0;
        obstacle.Position.Y = o.Position.Y || 0;
      }
      return obstacle;
    });

    // Map start positions
    level.StartPositionsList = (data.StartPositionsList || []).map((sp: any) => {
      const startPosition = new LevelPoint();
      startPosition.X = sp.X || 0;
      startPosition.Y = sp.Y || 0;
      return startPosition;
    });
    
    return level;
  }

  onImport(): void {
    if (this.isValidJson && this.fileContent) {
      try {
        const parsedData = JSON.parse(this.fileContent);
        
        if (this.importType === 'items') {
          const items = this.deserializeItems(parsedData);
          this.store.dispatch(loadItems({ items }));
          this.dialogRef.close({ type: 'items', data: items });
        } else {
          const level = this.deserializeLevel(parsedData);
          this.store.dispatch(loadLevel({ level }));
          this.dialogRef.close({ type: 'level', data: level });
        }
      } catch (error) {
        this.errorMessage = this.importType === 'items' ? 'Failed to import items data' : 'Failed to import level data';
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
