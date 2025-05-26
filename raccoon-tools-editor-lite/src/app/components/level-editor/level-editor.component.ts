import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { PlayerData, EnemyData, ObstacleData } from '../../models/level.model';
import { selectPlayers, selectEnemies, selectObstacles } from '../../store/level.selectors';
import * as LevelActions from '../../store/level.actions';

@Component({
  selector: 'app-level-editor',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.scss']
})
export class LevelEditorComponent {
  players$: Observable<PlayerData[]>;
  enemies$: Observable<EnemyData[]>;
  obstacles$: Observable<ObstacleData[]>;

  private playerIdCounter = 1;
  private enemyIdCounter = 1;
  private obstacleIdCounter = 1;

  constructor(private store: Store) {
    this.players$ = this.store.select(selectPlayers);
    this.enemies$ = this.store.select(selectEnemies);
    this.obstacles$ = this.store.select(selectObstacles);
  }

  addPlayer() {
    const player = new PlayerData();
    player.ID = this.playerIdCounter++;
    player.PlayerType = Math.floor(Math.random() * 3) + 1;
    player.Health = 100;
    
    this.store.dispatch(LevelActions.addPlayer({ player }));
  }

  addEnemy() {
    const enemy = new EnemyData();
    enemy.ID = this.enemyIdCounter++;
    enemy.EnemyType = Math.floor(Math.random() * 3) + 1;
    enemy.Health = 50;
    
    this.store.dispatch(LevelActions.addEnemy({ enemy }));
  }

  addObstacle() {
    const obstacle = new ObstacleData();
    obstacle.ID = this.obstacleIdCounter++;
    obstacle.ObstacleType = Math.floor(Math.random() * 3) + 1;
    obstacle.Health = 25;
    
    this.store.dispatch(LevelActions.addObstacle({ obstacle }));
  }
}
