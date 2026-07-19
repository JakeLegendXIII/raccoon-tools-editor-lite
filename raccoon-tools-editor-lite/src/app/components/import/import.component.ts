import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  BaseEnemyType,
  BasePlayerType,
  BiomeType,
  EnemyData,
  Level,
  LevelPoint,
  LevelType,
  ObstacleData,
  ObstacleType,
  PlayerData
} from '../../models/level.model';
import { Item, ItemType, TargetType } from '../../models/item.model';
import { loadLevels } from '../../store/level.actions';
import { loadItems } from '../../store/items.actions';

export type ImportType = 'level' | 'items';

const MAX_ID = 50000;
const MAX_GRID_SIZE = 100;
const MAX_CELL_SIZE = 256;
const MIN_CELL_SIZE = 16;
const MAX_TEXT_LENGTH = 200;
const MAX_ENTITY_STAT = 9999;
const MAX_TURNS = 9999;
const MAX_RANGE = 99;

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

  private toClampedNumber(value: unknown, fallback: number, min: number, max: number): number {
    const numericValue = typeof value === 'string' ? Number(value.trim()) : Number(value);
    if (!Number.isFinite(numericValue)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, numericValue));
  }

  private toClampedInteger(value: unknown, fallback: number, min: number, max: number): number {
    return Math.round(this.toClampedNumber(value, fallback, min, max));
  }

  private toSanitizedString(value: unknown, maxLength: number): string {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim().slice(0, maxLength);
  }

  private toBoolean(value: unknown, fallback: boolean = false): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalizedValue = value.trim().toLowerCase();
      if (normalizedValue === 'true') {
        return true;
      }

      if (normalizedValue === 'false') {
        return false;
      }
    }

    return fallback;
  }

  private toEnumValue<T extends Record<string, string | number>>(
    enumType: T,
    value: unknown,
    fallback: number
  ): number {
    const numericValue = this.toClampedInteger(value, fallback, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    return Object.values(enumType).includes(numericValue) ? numericValue : fallback;
  }

  private toLevelPoint(data: any, maxX: number, maxY: number): LevelPoint {
    const point = new LevelPoint();
    point.X = this.toClampedInteger(data?.X, 0, 0, maxX);
    point.Y = this.toClampedInteger(data?.Y, 0, 0, maxY);
    return point;
  }

  private deserializeItems(data: any[]): Item[] {
    return data.map((i: any) => {
      const item = new Item();
      item.ID = this.toClampedInteger(i?.ID, 0, 0, MAX_ID);
      item.Name = this.toSanitizedString(i?.Name, 80);
      item.Description = this.toSanitizedString(i?.Description, MAX_TEXT_LENGTH);
      item.ChangeValue = this.toClampedInteger(i?.ChangeValue, 0, -MAX_ENTITY_STAT, MAX_ENTITY_STAT);
      item.ItemType = this.toEnumValue(ItemType, i?.ItemType, ItemType.Attack);
      item.UseCount = this.toClampedInteger(i?.UseCount, 1, 1, 99);
      item.TargetRange = this.toClampedInteger(i?.TargetRange, 0, 0, MAX_RANGE);
      item.TargetType = this.toEnumValue(TargetType, i?.TargetType, TargetType.Self);
      item.UsageRange = this.toClampedInteger(i?.UsageRange, 0, 0, MAX_RANGE);
      return item;
    });
  }

  private deserializeLevel(data: any): Level {
    const level = new Level();
    const gridWidth = this.toClampedInteger(data?.GridWidth, 8, 1, MAX_GRID_SIZE);
    const gridHeight = this.toClampedInteger(data?.GridHeight, 8, 1, MAX_GRID_SIZE);
    const maxGridX = Math.max(0, gridWidth - 1);
    const maxGridY = Math.max(0, gridHeight - 1);
    
    // Map basic properties
    level.ID = this.toClampedInteger(data?.ID, 0, 0, MAX_ID);
    level.GridWidth = gridWidth;
    level.GridHeight = gridHeight;
    level.CellSize = this.toClampedInteger(data?.CellSize, 64, MIN_CELL_SIZE, MAX_CELL_SIZE);
    level.LevelType = this.toEnumValue(LevelType, data?.LevelType, LevelType.Deathmatch);
    level.LevelDescription = this.toSanitizedString(data?.LevelDescription, MAX_TEXT_LENGTH);
    level.BiomeType = this.toEnumValue(BiomeType, data?.BiomeType, BiomeType.Forest);
    level.NumberOfTurns = this.toClampedInteger(data?.NumberOfTurns, 0, 0, MAX_TURNS);
    
    // Map win position
    level.WinPosition = this.toLevelPoint(data?.WinPosition, maxGridX, maxGridY);

    // Map arrays
    level.Players = (data.Players || []).map((p: any) => {
      const player = new PlayerData();
      player.ID = this.toClampedInteger(p?.ID, 0, 0, MAX_ID);
      player.PlayerType = this.toEnumValue(BasePlayerType, p?.PlayerType, BasePlayerType.Paladin);
      player.Health = this.toClampedInteger(p?.Health, 0, 0, MAX_ENTITY_STAT);
      player.Height = this.toClampedInteger(p?.Height, 1, 1, MAX_GRID_SIZE);
      player.Width = this.toClampedInteger(p?.Width, 1, 1, MAX_GRID_SIZE);
      player.StartPosition = this.toLevelPoint(p?.StartPosition, maxGridX, maxGridY);
      return player;
    });

    level.Enemies = (data.Enemies || []).map((e: any) => {
      const enemy = new EnemyData();
      enemy.ID = this.toClampedInteger(e?.ID, 0, 0, MAX_ID);
      enemy.EnemyType = this.toEnumValue(BaseEnemyType, e?.EnemyType, BaseEnemyType.Grunt);
      enemy.Health = this.toClampedInteger(e?.Health, 0, 0, MAX_ENTITY_STAT);
      enemy.Height = this.toClampedInteger(e?.Height, 1, 1, MAX_GRID_SIZE);
      enemy.Width = this.toClampedInteger(e?.Width, 1, 1, MAX_GRID_SIZE);
      enemy.StartPosition = this.toLevelPoint(e?.StartPosition, maxGridX, maxGridY);
      return enemy;
    });

    level.Obstacles = (data.Obstacles || []).map((o: any) => {
      const obstacle = new ObstacleData();
      obstacle.ID = this.toClampedInteger(o?.ID, 0, 0, MAX_ID);
      obstacle.Health = this.toClampedInteger(o?.Health, 0, 0, MAX_ENTITY_STAT);
      obstacle.Height = this.toClampedInteger(o?.Height, 1, 1, MAX_GRID_SIZE);
      obstacle.Width = this.toClampedInteger(o?.Width, 1, 1, MAX_GRID_SIZE);
      obstacle.ObstacleType = this.toEnumValue(ObstacleType, o?.ObstacleType, ObstacleType.Mountain);
      obstacle.IsWalkable = this.toBoolean(o?.IsWalkable, false);
      obstacle.IsDestructible = this.toBoolean(o?.IsDestructible, false);
      obstacle.IsInteractive = this.toBoolean(o?.IsInteractive, false);
      obstacle.Position = this.toLevelPoint(o?.Position, maxGridX, maxGridY);
      return obstacle;
    });

    // Map start positions
    level.StartPositionsList = (data.StartPositionsList || []).map((sp: any) => {
      return this.toLevelPoint(sp, maxGridX, maxGridY);
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
