import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { Level } from '../../models/level.model';
import { Item } from '../../models/item.model';
import { selectCurrentLevel } from '../../store/level.selectors';
import { selectItems } from '../../store/items.selectors';

export type ExportType = 'level' | 'items';

@Component({
  selector: 'app-export',
  imports: [CommonModule, FormsModule, MatButtonToggleModule],
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  private store = inject(Store);

  currentLevel$: Observable<Level | null>;
  items$: Observable<Item[]>;
  fileName: string = 'level';
  exportType: ExportType = 'level';

  constructor() {
    this.currentLevel$ = this.store.select(selectCurrentLevel);
    this.items$ = this.store.select(selectItems);
  }

  onExportTypeChange(): void {
    // Update default filename based on export type
    this.fileName = this.exportType === 'level' ? 'level' : 'items';
  }

  exportLevel() {
    this.currentLevel$.subscribe(level => {
      if (level) {
        this.downloadJSON(level, this.fileName);
      }
    }).unsubscribe();
  }

  exportItems() {
    this.items$.subscribe(items => {
      if (items && items.length > 0) {
        this.downloadJSON(items, this.fileName);
      }
    }).unsubscribe();
  }

  private downloadJSON(data: Level | Item[], filename: string) {
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
