import { Routes } from '@angular/router';
import { LevelEditorComponent } from './components/level-editor/level-editor.component';
import { PlayerListComponent } from './components/player/player-list/player-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/level-editor', pathMatch: 'full' },
  { path: 'level-editor', component: LevelEditorComponent },
  { path: 'player-list', component: PlayerListComponent}
];
