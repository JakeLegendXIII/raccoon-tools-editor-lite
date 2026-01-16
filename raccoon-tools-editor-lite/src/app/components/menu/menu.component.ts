import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportComponent } from '../import/import.component';

@Component({
  selector: 'app-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  openImportDialog(): void {
    const dialogRef = this.dialog.open(ImportComponent, {
      width: '400px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Import dialog closed with result:', result);
      }
    });
  }

  navigateToLevelHeader(): void {
    this.router.navigate(['/level-header']);
  }

  navigateToPlayerList(): void {
    this.router.navigate(['/player-list']);
  }

  navigateToEnemyList(): void {
    this.router.navigate(['/enemy-list']);
  }  
  
  navigateToObstacleList(): void {
    this.router.navigate(['/obstacle-list']);
  }
  
  navigateToExport(): void {
    this.router.navigate(['/export']);
  }

  navigateToVisualizer(): void {
    this.router.navigate(['/visualizer']);
  }

  navigateToConversion(): void {
    this.router.navigate(['/conversion']);
  }

  navigateToStartPositionList(): void {
    this.router.navigate(['/start-position']);
  }

  navigateToItemList(): void {
    this.router.navigate(['/items']);
  }
}
