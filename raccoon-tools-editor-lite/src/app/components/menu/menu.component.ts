import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportComponent } from '../import/import.component';

@Component({
  selector: 'app-menu',
  imports: [MatButtonModule, MatMenuModule], 
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
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

  navigateToLevelEditor(): void {
    this.router.navigate(['/level-editor']);
  }
}
