import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerData, EnemyData, ObstacleData, LevelPoint, LevelType } from '../../models/level.model';
import { 
  selectPlayers, 
  selectEnemies, 
  selectObstacles,
  selectLevelGridWidth,
  selectLevelGridHeight,
  selectLevelCellSize,
  selectLevelType,
  selectLevelDescription,
  selectWinPosition
} from '../../store/level.selectors';
import * as LevelActions from '../../store/level.actions';
import { VisualizerComponent } from '../visualizer/visualizer.component';

@Component({
  selector: 'app-level-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VisualizerComponent
  ],  
  templateUrl: './level-viewer.component.html',
  styleUrls: ['./level-viewer.component.scss']
})
export class LevelViewerComponent {
  players$: Observable<PlayerData[]>;
  enemies$: Observable<EnemyData[]>;
  obstacles$: Observable<ObstacleData[]>;
  
  gridWidth$: Observable<number>;
  gridHeight$: Observable<number>;
  cellSize$: Observable<number>;
  levelType$: Observable<number>;
  levelDescription$: Observable<string>;
  winPosition$: Observable<LevelPoint>;

  // Current values for form handling
  currentWinPosition: LevelPoint = { X: 0, Y: 0 };

  // Level Type enum for template
  LevelType = LevelType;
  levelTypeKeys = Object.keys(LevelType).filter(key => isNaN(Number(key)));

  constructor(private store: Store) {
    this.players$ = this.store.select(selectPlayers);
    this.enemies$ = this.store.select(selectEnemies);
    this.obstacles$ = this.store.select(selectObstacles);
    
    this.gridWidth$ = this.store.select(selectLevelGridWidth);
    this.gridHeight$ = this.store.select(selectLevelGridHeight);
    this.cellSize$ = this.store.select(selectLevelCellSize);
    this.levelType$ = this.store.select(selectLevelType);
    this.levelDescription$ = this.store.select(selectLevelDescription);
    this.winPosition$ = this.store.select(selectWinPosition);

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
}
