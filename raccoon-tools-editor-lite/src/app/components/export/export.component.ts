import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Level } from '../../models/level.model';
import { selectCurrentLevel } from '../../store/level.selectors';

@Component({
  selector: 'app-export',
  imports: [CommonModule, FormsModule],
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  currentLevel$: Observable<Level | null>;
  fileName: string = 'level';

  constructor(private store: Store) {
    this.currentLevel$ = this.store.select(selectCurrentLevel);
  }

  exportLevel() {
    this.currentLevel$.subscribe(level => {
      if (level) {
        this.downloadJSON(level, this.fileName);
      }
    }).unsubscribe();
  }

  private downloadJSON(data: Level, filename: string) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
