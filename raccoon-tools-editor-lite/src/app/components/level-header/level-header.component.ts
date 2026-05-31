import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerData, EnemyData, ObstacleData, LevelPoint, LevelType, BasePlayerType, BaseEnemyType, ObstacleType, BiomeType } from '../../models/level.model';
import { 
  selectLoadedLevels,
  selectPlayers, 
  selectEnemies, 
  selectObstacles,
  selectLevelGridWidth,
  selectLevelGridHeight,
  selectLevelCellSize,
  selectLevelType,
  selectLevelDescription,
  selectWinPosition,
  selectNumberOfTurns,
  selectLevelID,
  selectBiomeType,
  selectSelectedLevelIndex
} from '../../store/level.selectors';
import * as LevelActions from '../../store/level.actions';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import { Level } from '../../models/level.model';

@Component({
  selector: 'app-level-header',  
  imports: [
    CommonModule,
    FormsModule,
    VisualizerComponent
  ],  
  templateUrl: './level-header.component.html',
  styleUrls: ['./level-header.component.scss']
})
export class LevelHeaderComponent {
  private store = inject(Store);

  players$: Observable<PlayerData[]>;
  enemies$: Observable<EnemyData[]>;
  obstacles$: Observable<ObstacleData[]>;
  loadedLevels$: Observable<Level[]>;
  selectedLevelIndex$: Observable<number>;
  
  iD$: Observable<number>;
  gridWidth$: Observable<number>;
  gridHeight$: Observable<number>;
  cellSize$: Observable<number>;
  levelType$: Observable<number>;
  biomeType$: Observable<number>;
  levelDescription$: Observable<string>;
  winPosition$: Observable<LevelPoint>;
  numberOfTurns$: Observable<number>;

  // Current values for form handling
  currentWinPosition: LevelPoint = { X: 0, Y: 0 };
  currentLoadedLevels: Level[] = [];
  currentSelectedLevelIndex: number = 0;
  // Level Type enum for template
  LevelType = LevelType;
  levelTypeKeys = Object.keys(LevelType).filter(key => isNaN(Number(key)));
  
  // Generate level type options with correct enum values
  levelTypeOptions = Object.keys(LevelType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      name: key,
      value: LevelType[key as keyof typeof LevelType]
    }));

  // Biome Type enum for template
  BiomeType = BiomeType;
  biomeTypeKeys = Object.keys(BiomeType).filter(key => isNaN(Number(key)));
  
  // Generate biome type options with correct enum values
  biomeTypeOptions = Object.keys(BiomeType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      name: key,
      value: BiomeType[key as keyof typeof BiomeType]
    }));

  BasePlayerType = BasePlayerType;
  BaseEnemyType = BaseEnemyType;
  ObstacleType = ObstacleType;

  constructor() {
    this.loadedLevels$ = this.store.select(selectLoadedLevels);
    this.selectedLevelIndex$ = this.store.select(selectSelectedLevelIndex);
    this.players$ = this.store.select(selectPlayers);
    this.enemies$ = this.store.select(selectEnemies);
    this.obstacles$ = this.store.select(selectObstacles);
    
    this.iD$ = this.store.select(selectLevelID);
    this.gridWidth$ = this.store.select(selectLevelGridWidth);
    this.gridHeight$ = this.store.select(selectLevelGridHeight);
    this.cellSize$ = this.store.select(selectLevelCellSize);
    this.levelType$ = this.store.select(selectLevelType);
    this.biomeType$ = this.store.select(selectBiomeType);
    this.levelDescription$ = this.store.select(selectLevelDescription);
    this.winPosition$ = this.store.select(selectWinPosition);
    this.numberOfTurns$ = this.store.select(selectNumberOfTurns);

    // Subscribe to win position changes to keep current value updated
    this.winPosition$.subscribe(pos => {
      this.currentWinPosition = pos || { X: 0, Y: 0 };
    });

    this.loadedLevels$.subscribe(levels => {
      this.currentLoadedLevels = levels;
    });

    this.selectedLevelIndex$.subscribe(index => {
      this.currentSelectedLevelIndex = index;
    });
  }

  updateGridWidth(value: number) {
    this.store.dispatch(LevelActions.updateLevelProperties({ gridWidth: value }));
  }

  updateGridHeight(value: number) {
    this.store.dispatch(LevelActions.updateLevelProperties({ gridHeight: value }));
  }

  updateCellSize(value: number) {
    this.store.dispatch(LevelActions.updateLevelProperties({ cellSize: value }));
  }

  updateLevelType(value: number | string) {
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.store.dispatch(LevelActions.updateLevelProperties({ levelType: numericValue }));
  }

  updateBiomeType(value: number | string) {
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.store.dispatch(LevelActions.updateLevelProperties({ biomeType: numericValue }));
  }

  updateLevelDescription(value: string) {
    this.store.dispatch(LevelActions.updateLevelProperties({ levelDescription: value }));
  }

  updateWinPosition(x: number, y: number) {
    this.store.dispatch(LevelActions.updateWinPosition({ winPosition: { X: x, Y: y } }));
  }

  updateNumberOfTurns(value: number) {
    this.store.dispatch(LevelActions.updateLevelProperties({ numberOfTurns: value }));
  }

  updateID(value: number) {
    this.store.dispatch(LevelActions.updateLevelProperties({ id: value }));
  }

  createLevel() {
    const nextLevelId = this.getNextLevelId();
    const level = new Level();
    level.ID = nextLevelId;
    level.GridWidth = 8;
    level.GridHeight = 8;
    level.CellSize = 64;
    level.LevelDescription = `Level ${nextLevelId}`;
    level.NumberOfTurns = 0;

    this.store.dispatch(LevelActions.loadLevel({ level }));
  }

  duplicateLevel() {
    const sourceLevel = this.currentLoadedLevels[this.currentSelectedLevelIndex];
    if (!sourceLevel) {
      return;
    }

    const duplicatedLevel = this.cloneLevel(sourceLevel);
    const nextLevelId = this.getNextLevelId();
    duplicatedLevel.ID = nextLevelId;
    duplicatedLevel.LevelDescription = this.getDuplicatedLevelDescription(sourceLevel.LevelDescription, nextLevelId);

    this.store.dispatch(LevelActions.loadLevel({ level: duplicatedLevel }));
  }

  selectLevel(levelIndex: number | string) {
    const numericValue = typeof levelIndex === 'string' ? parseInt(levelIndex, 10) : levelIndex;
    this.store.dispatch(LevelActions.selectLevel({ levelIndex: numericValue }));
  }

  private getNextLevelId(): number {
    return this.currentLoadedLevels.reduce((maxId, level) => {
      return Math.max(maxId, level.ID || 0);
    }, 0) + 1;
  }

  private getDuplicatedLevelDescription(description: string, levelId: number): string {
    const trimmedDescription = description.trim();
    return trimmedDescription ? `${trimmedDescription} Copy` : `Level ${levelId}`;
  }

  private cloneLevel(levelToClone: Level): Level {
    const duplicatedLevel = new Level();
    duplicatedLevel.ID = levelToClone.ID;
    duplicatedLevel.GridWidth = levelToClone.GridWidth;
    duplicatedLevel.GridHeight = levelToClone.GridHeight;
    duplicatedLevel.CellSize = levelToClone.CellSize;
    duplicatedLevel.LevelType = levelToClone.LevelType;
    duplicatedLevel.LevelDescription = levelToClone.LevelDescription;
    duplicatedLevel.BiomeType = levelToClone.BiomeType;
    duplicatedLevel.NumberOfTurns = levelToClone.NumberOfTurns;
    duplicatedLevel.WinPosition = this.cloneLevelPoint(levelToClone.WinPosition);
    duplicatedLevel.StartPositionsList = levelToClone.StartPositionsList.map((position) => this.cloneLevelPoint(position));
    duplicatedLevel.Players = levelToClone.Players.map((player) => {
      const duplicatedPlayer = new PlayerData();
      duplicatedPlayer.ID = player.ID;
      duplicatedPlayer.PlayerType = player.PlayerType;
      duplicatedPlayer.Health = player.Health;
      duplicatedPlayer.Height = player.Height;
      duplicatedPlayer.Width = player.Width;
      duplicatedPlayer.StartPosition = this.cloneLevelPoint(player.StartPosition);
      return duplicatedPlayer;
    });
    duplicatedLevel.Enemies = levelToClone.Enemies.map((enemy) => {
      const duplicatedEnemy = new EnemyData();
      duplicatedEnemy.ID = enemy.ID;
      duplicatedEnemy.EnemyType = enemy.EnemyType;
      duplicatedEnemy.Health = enemy.Health;
      duplicatedEnemy.Height = enemy.Height;
      duplicatedEnemy.Width = enemy.Width;
      duplicatedEnemy.StartPosition = this.cloneLevelPoint(enemy.StartPosition);
      return duplicatedEnemy;
    });
    duplicatedLevel.Obstacles = levelToClone.Obstacles.map((obstacle) => {
      const duplicatedObstacle = new ObstacleData();
      duplicatedObstacle.ID = obstacle.ID;
      duplicatedObstacle.Health = obstacle.Health;
      duplicatedObstacle.Height = obstacle.Height;
      duplicatedObstacle.Width = obstacle.Width;
      duplicatedObstacle.ObstacleType = obstacle.ObstacleType;
      duplicatedObstacle.IsWalkable = obstacle.IsWalkable;
      duplicatedObstacle.IsDestructible = obstacle.IsDestructible;
      duplicatedObstacle.IsInteractive = obstacle.IsInteractive;
      duplicatedObstacle.Position = this.cloneLevelPoint(obstacle.Position);
      return duplicatedObstacle;
    });

    return duplicatedLevel;
  }

  private cloneLevelPoint(levelPoint: LevelPoint): LevelPoint {
    const duplicatedPoint = new LevelPoint();
    duplicatedPoint.X = levelPoint.X;
    duplicatedPoint.Y = levelPoint.Y;
    return duplicatedPoint;
  }

  onGridWidthChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateGridWidth(+target.value);
  }

  onGridHeightChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateGridHeight(+target.value);
  }
  onCellSizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateCellSize(+target.value);
  }

  onLevelDescriptionInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateLevelDescription(target.value);
  }
  onWinXChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateWinPosition(+target.value, this.currentWinPosition.Y);
  }

  onWinYChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateWinPosition(this.currentWinPosition.X, +target.value);
  }

  onNumberOfTurnsChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateNumberOfTurns(+target.value);
  }

  onIDChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateID(+target.value);
  }

  getLevelTypeName(levelType: number): string {
    return LevelType[levelType] || 'Unknown';
  }

  getBiomeTypeName(biomeType: number): string {
    return BiomeType[biomeType] || 'Unknown';
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

  getLevelOptionLabel(level: Level, index: number): string {
    const levelId = level.ID || index + 1;
    const description = level.LevelDescription?.trim() || 'Untitled Level';
    return `${levelId} - ${description}`;
  }
}
