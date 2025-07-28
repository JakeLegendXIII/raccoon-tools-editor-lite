import { Routes } from '@angular/router';
// import { LevelViewerComponent } from './components/level-viewer/level-viewer.component';
import { PlayerListComponent } from './components/player/player-list/player-list.component';
import { EnemyListComponent } from './components/enemy/enemy-list/enemy-list.component';
import { ObstacleListComponent } from './components/obstacle/obstacle-list/obstacle-list.component';
import { ExportComponent } from './components/export/export.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { LevelHeaderComponent } from './components/level-header/level-header.component';
import { ConversionComponent } from './components/conversion/conversion.component';

export const routes: Routes = [
  { path: '', redirectTo: '/visualizer', pathMatch: 'full' },  
  { path: 'level-header', component: LevelHeaderComponent },
  { path: 'player-list', component: PlayerListComponent },
  { path: 'enemy-list', component: EnemyListComponent },
  { path: 'obstacle-list', component: ObstacleListComponent },
  { path: 'export', component: ExportComponent },
  { path: 'visualizer', component: VisualizerComponent },
  { path: 'conversion', component: ConversionComponent },
  { path: '**', redirectTo: '/visualizer' } // Wildcard route for unmatched paths 
];
