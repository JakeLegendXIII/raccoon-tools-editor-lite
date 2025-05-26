import { Routes } from '@angular/router';
import { LevelViewerComponent } from './components/level-viewer/level-viewer.component';
import { PlayerListComponent } from './components/player/player-list/player-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/level-viewer', pathMatch: 'full' },
  { path: 'level-viewer', component: LevelViewerComponent },
  { path: 'player-list', component: PlayerListComponent}
];
