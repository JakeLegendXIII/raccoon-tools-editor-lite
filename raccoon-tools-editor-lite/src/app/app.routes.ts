import { Routes } from '@angular/router';
import { LevelViewerComponent } from './components/level-viewer/level-viewer.component';
import { PlayerListComponent } from './components/player/player-list/player-list.component';
import { EnemyListComponent } from './components/enemy/enemy-list/enemy-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/level-viewer', pathMatch: 'full' },
  { path: 'level-viewer', component: LevelViewerComponent },
  { path: 'player-list', component: PlayerListComponent },
  { path: 'enemy-list', component: EnemyListComponent }
];
