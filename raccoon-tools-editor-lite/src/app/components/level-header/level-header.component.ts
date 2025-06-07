import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerData, EnemyData, ObstacleData, LevelPoint, LevelType, BasePlayerType, BaseEnemyType, ObstacleType } from '../../models/level.model';
import { 
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
  selectLevelID
} from '../../store/level.selectors';
import * as LevelActions from '../../store/level.actions';
import { VisualizerComponent } from '../visualizer/visualizer.component';

@Component({
  selector: 'app-level-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VisualizerComponent
  ],  
  templateUrl: './level-header.component.html',
  styleUrls: ['./level-header.component.scss']
})
export class LevelHeaderComponent {
  players$: Observable<PlayerData[]>;
  enemies$: Observable<EnemyData[]>;
  obstacles$: Observable<ObstacleData[]>;
  
  iD$: Observable<number>;
  gridWidth$: Observable<number>;
  gridHeight$: Observable<number>;
  cellSize$: Observable<number>;
  levelType$: Observable<number>;
  levelDescription$: Observable<string>;
  winPosition$: Observable<LevelPoint>;
  numberOfTurns$: Observable<number>;

  // Current values for form handling
  currentWinPosition: LevelPoint = { X: 0, Y: 0 };
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

  BasePlayerType = BasePlayerType;
  BaseEnemyType = BaseEnemyType;
  ObstacleType = ObstacleType;

  constructor(private store: Store) {
    this.players$ = this.store.select(selectPlayers);
    this.enemies$ = this.store.select(selectEnemies);
    this.obstacles$ = this.store.select(selectObstacles);
    
    this.iD$ = this.store.select(selectLevelID);
    this.gridWidth$ = this.store.select(selectLevelGridWidth);
    this.gridHeight$ = this.store.select(selectLevelGridHeight);
    this.cellSize$ = this.store.select(selectLevelCellSize);
    this.levelType$ = this.store.select(selectLevelType);
    this.levelDescription$ = this.store.select(selectLevelDescription);
    this.winPosition$ = this.store.select(selectWinPosition);
    this.numberOfTurns$ = this.store.select(selectNumberOfTurns);

    // Subscribe to win position changes to keep current value updated
    this.winPosition$.subscribe(pos => {
      this.currentWinPosition = pos || { X: 0, Y: 0 };
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

  updateLevelType(value: number) {
    this.store.dispatch(LevelActions.updateLevelProperties({ levelType: value }));
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

  onLevelTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateLevelType(+target.value);
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
