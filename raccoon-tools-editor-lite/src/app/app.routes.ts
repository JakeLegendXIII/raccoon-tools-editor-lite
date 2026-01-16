import { Routes } from '@angular/router';
import { PlayerListComponent } from './components/player/player-list/player-list.component';
import { EnemyListComponent } from './components/enemy/enemy-list/enemy-list.component';
import { ObstacleListComponent } from './components/obstacle/obstacle-list/obstacle-list.component';
import { ExportComponent } from './components/export/export.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { LevelHeaderComponent } from './components/level-header/level-header.component';
import { ConversionComponent } from './components/conversion/conversion.component';
import { StartPositionListComponent } from './components/start-position/start-position-list/start-position-list.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/visualizer', pathMatch: 'full' },  
  { path: 'level-header', component: LevelHeaderComponent },
  { path: 'player-list', component: PlayerListComponent },
  { path: 'enemy-list', component: EnemyListComponent },
  { path: 'obstacle-list', component: ObstacleListComponent },
  { path: 'export', component: ExportComponent },
  { path: 'visualizer', component: VisualizerComponent },
  { path: 'conversion', component: ConversionComponent },
  { path: 'start-position', component: StartPositionListComponent },
  { path: 'items', component: ItemListComponent },
  { path: '**', redirectTo: '/visualizer' } // Wildcard route for unmatched paths 
];
