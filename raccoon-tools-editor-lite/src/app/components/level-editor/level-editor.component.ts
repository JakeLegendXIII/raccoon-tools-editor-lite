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
  template: `
    <div class="level-editor">
      <h2>Level Editor</h2>
      
      <div class="actions">
        <button (click)="addPlayer()">Add Player</button>
        <button (click)="addEnemy()">Add Enemy</button>
        <button (click)="addObstacle()">Add Obstacle</button>
      </div>

      <div class="lists">
        <div class="list">
          <h3>Players ({{ (players$ | async)?.length || 0 }})</h3>
          <ul>
            <li *ngFor="let player of players$ | async">
              Player {{ player.ID }} - Type: {{ player.PlayerType }}
            </li>
          </ul>
        </div>

        <div class="list">
          <h3>Enemies ({{ (enemies$ | async)?.length || 0 }})</h3>
          <ul>
            <li *ngFor="let enemy of enemies$ | async">
              Enemy {{ enemy.ID }} - Type: {{ enemy.EnemyType }}
            </li>
          </ul>
        </div>

        <div class="list">
          <h3>Obstacles ({{ (obstacles$ | async)?.length || 0 }})</h3>
          <ul>
            <li *ngFor="let obstacle of obstacles$ | async">
              Obstacle {{ obstacle.ID }} - Type: {{ obstacle.ObstacleType }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .level-editor {
      padding: 20px;
    }
    .actions {
      margin-bottom: 20px;
    }
    .actions button {
      margin-right: 10px;
      padding: 8px 16px;
    }
    .lists {
      display: flex;
      gap: 20px;
    }
    .list {
      flex: 1;
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 4px;
    }
  `]
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
