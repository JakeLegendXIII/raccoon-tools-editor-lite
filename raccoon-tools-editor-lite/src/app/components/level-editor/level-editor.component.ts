import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { Level } from '../../models/level.model';
import { selectCurrentLevel } from '../../store/level.selectors';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import { PlayerListComponent } from '../player/player-list/player-list.component';
import { EnemyListComponent } from '../enemy/enemy-list/enemy-list.component';
import { ObstacleListComponent } from '../obstacle/obstacle-list/obstacle-list.component';
import { StartPositionListComponent } from '../start-position/start-position-list/start-position-list.component';

@Component({
  selector: 'app-level-editor',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    VisualizerComponent,
    PlayerListComponent,
    EnemyListComponent,
    ObstacleListComponent,
    StartPositionListComponent
  ],
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.scss']
})
export class LevelEditorComponent {
  private store = inject(Store);

  counts$: Observable<{ players: number; enemies: number; obstacles: number; startPositions: number }>;

  constructor() {
    this.counts$ = this.store.select(selectCurrentLevel).pipe(
      map((level: Level | null) => ({
        players: level?.Players?.length ?? 0,
        enemies: level?.Enemies?.length ?? 0,
        obstacles: level?.Obstacles?.length ?? 0,
        startPositions: level?.StartPositionsList?.length ?? 0
      }))
    );
  }
}
