import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Item } from '../../../models/item.model';
import { selectItems } from '../../../store/items.selectors';
import { loadItems } from '../../../store/items.actions';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  private store = inject(Store);

  items$: Observable<Item[]>;

  constructor() {
    this.items$ = this.store.select(selectItems);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const items = JSON.parse(content) as Item[];
          this.store.dispatch(loadItems({ items }));
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset input so the same file can be selected again
    input.value = '';
  }

  exportItems(): void {
    this.items$.subscribe(items => {
      if (items && items.length > 0) {
        const jsonStr = JSON.stringify(items, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'items.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }).unsubscribe();
  }
}
