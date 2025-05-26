import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { PlayerData, EnemyData, ObstacleData } from '../../models/level.model';
import { selectPlayers, selectEnemies, selectObstacles } from '../../store/level.selectors';
import * as LevelActions from '../../store/level.actions';

@Component({
  selector: 'app-level-viewer',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './level-viewer.component.html',
  styleUrls: ['./level-viewer.component.scss']
})
export class LevelViewerComponent {
  players$: Observable<PlayerData[]>;
  enemies$: Observable<EnemyData[]>;
  obstacles$: Observable<ObstacleData[]>;

  constructor(private store: Store) {
    this.players$ = this.store.select(selectPlayers);
    this.enemies$ = this.store.select(selectEnemies);
    this.obstacles$ = this.store.select(selectObstacles);
  }
}
