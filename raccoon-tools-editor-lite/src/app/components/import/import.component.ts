import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Level, LevelPoint, PlayerData, EnemyData, ObstacleData } from '../../models/level.model';
import { Item, ItemType } from '../../models/item.model';
import { loadLevels } from '../../store/level.actions';
import { loadItems } from '../../store/items.actions';

export type ImportType = 'level' | 'items';

@Component({
  selector: 'app-import',
  imports: [
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

  selectedFiles: File[] = [];
  fileContents: string[] = [];
  isValidJson: boolean = false;
  errorMessage: string = '';
  importType: ImportType = 'level';

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files ?? []) as File[];

    if (files.length === 0) {
      this.resetSelection();
      return;
    }

    const hasInvalidFile = files.some((file) => !this.isJsonFile(file));
    if (hasInvalidFile) {
      this.errorMessage = 'Please select a valid JSON file';
      this.resetSelection(false);
      return;
    }

    if (this.importType === 'items' && files.length > 1) {
      this.errorMessage = 'Items import only supports a single JSON file';
      this.resetSelection(false);
      return;
    }

    this.selectedFiles = files;
    void this.readFiles(files);
  }

  private isJsonFile(file: File): boolean {
    return file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsText(file);
    });
  }

  private async readFiles(files: File[]): Promise<void> {
    try {
      const fileContents = await Promise.all(files.map((file) => this.readFile(file)));
      const parsedFiles = fileContents.map((content) => JSON.parse(content));

      if (this.importType === 'items') {
        if (!Array.isArray(parsedFiles[0])) {
          this.errorMessage = 'Invalid items format: expected an array of items';
          this.isValidJson = false;
          return;
        }
      } else if (!parsedFiles.every((data) => typeof data === 'object' && data !== null && !Array.isArray(data))) {
        this.errorMessage = 'Invalid level data format';
        this.isValidJson = false;
        return;
      }

      this.fileContents = fileContents;
      this.isValidJson = true;
      this.errorMessage = '';
    } catch {
      this.errorMessage = 'Invalid JSON format';
      this.fileContents = [];
      this.isValidJson = false;
    }
  }

  onImportTypeChange(): void {
    this.resetSelection();
  }

  private resetSelection(clearError: boolean = true): void {
    this.selectedFiles = [];
    this.fileContents = [];
    this.isValidJson = false;
    if (clearError) {
      this.errorMessage = '';
    }
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
    if (this.isValidJson && this.fileContents.length > 0) {
      try {
        if (this.importType === 'items') {
          const items = this.deserializeItems(JSON.parse(this.fileContents[0]));
          this.store.dispatch(loadItems({ items }));
          this.dialogRef.close({ type: 'items', data: items });
        } else {
          const levels = this.fileContents.map((fileContent) => this.deserializeLevel(JSON.parse(fileContent)));
          this.store.dispatch(loadLevels({ levels }));
          this.dialogRef.close({ type: 'level', data: levels });
        }
      } catch {
        this.errorMessage = this.importType === 'items' ? 'Failed to import items data' : 'Failed to import level data';
      }
    }
  }

  getSelectedFileLabel(): string {
    if (this.selectedFiles.length === 0) {
      return 'No file selected';
    }

    if (this.selectedFiles.length === 1) {
      return this.selectedFiles[0].name;
    }

    return `${this.selectedFiles.length} files selected`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
