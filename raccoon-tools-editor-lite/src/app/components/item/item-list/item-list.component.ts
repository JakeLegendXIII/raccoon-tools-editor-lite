import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, take } from 'rxjs';

import { Item, ItemType, TargetType } from '../../../models/item.model';
import { loadItems, addItem, updateItem, deleteItem } from '../../../store/items.actions';
import { selectItems } from '../../../store/items.selectors';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './item-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  private store = inject(Store);

  readonly items$: Observable<Item[]> = this.store.select(selectItems);
  readonly itemTypeOptions = Object.keys(ItemType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ label: key, value: ItemType[key as keyof typeof ItemType] }));
  readonly targetTypeOptions = Object.keys(TargetType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ label: key, value: TargetType[key as keyof typeof TargetType] }));

  editingItemId: number | null = null;
  editingItem: Item | null = null;
  errorMessage = '';

  getItemTypeName(value: ItemType): string {
    return ItemType[value];
  }

  getTargetTypeName(value: TargetType): string {
    return TargetType[value];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      this.errorMessage = 'Select a JSON file.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const items = this.deserializeItems(JSON.parse(String(reader.result)) as unknown);
        this.store.dispatch(loadItems({ items }));
        this.cancelEditing();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to import the JSON file.';
      }
    };
    reader.onerror = () => {
      this.errorMessage = `Unable to read ${file.name}.`;
    };
    reader.readAsText(file);
    input.value = '';
  }

  exportItems(): void {
    this.items$.pipe(take(1)).subscribe(items => {
      if (items.length === 0) {
        this.errorMessage = 'Add or import at least one item before exporting.';
        return;
      }

      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'items.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      this.errorMessage = '';
    });
  }

  async addNewItem(): Promise<void> {
    const items = await firstValueFrom(this.items$);
    const item = new Item();
    item.ID = items.length === 0 ? 1 : Math.max(...items.map(current => current.ID)) + 1;
    item.Name = 'New Item';
    this.store.dispatch(addItem({ item }));
    this.startEditing(item);
    this.errorMessage = '';
  }

  startEditing(item: Item): void {
    this.editingItemId = item.ID;
    this.editingItem = { ...item };
  }

  cancelEditing(): void {
    this.editingItemId = null;
    this.editingItem = null;
  }

  saveItem(): void {
    if (!this.editingItem) {
      return;
    }

    const name = this.editingItem.Name.trim();
    if (!name) {
      this.errorMessage = 'Name is required.';
      return;
    }

    const item = {
      ...this.editingItem,
      Name: name,
      Description: this.editingItem.Description.trim(),
      ChangeValue: Math.round(Number(this.editingItem.ChangeValue) || 0),
      UseCount: Math.max(1, Math.round(Number(this.editingItem.UseCount) || 1)),
      TargetRange: Math.max(0, Math.round(Number(this.editingItem.TargetRange) || 0)),
      UsageRange: Math.max(0, Math.round(Number(this.editingItem.UsageRange) || 0))
    };
    this.store.dispatch(updateItem({ item }));
    this.cancelEditing();
    this.errorMessage = '';
  }

  deleteItemById(itemId: number): void {
    if (confirm('Delete this item?')) {
      this.store.dispatch(deleteItem({ itemId }));
      if (this.editingItemId === itemId) {
        this.cancelEditing();
      }
    }
  }

  isEditing(itemId: number): boolean {
    return this.editingItemId === itemId;
  }

  private deserializeItems(data: unknown): Item[] {
    if (!Array.isArray(data)) {
      throw new Error('Invalid item file: expected an array.');
    }

    const ids = new Set<number>();
    return data.map((value, index) => {
      if (!this.isItemRecord(value)) {
        throw new Error(`Invalid item at position ${index + 1}.`);
      }

      if (ids.has(value.ID)) {
        throw new Error(`Duplicate item ID ${value.ID}.`);
      }
      ids.add(value.ID);

      return Object.assign(new Item(), value);
    });
  }

  private isItemRecord(value: unknown): value is Item {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const item = value as Record<keyof Item, unknown>;
    return Number.isInteger(item.ID)
      && (item.ID as number) >= 0
      && typeof item.Name === 'string'
      && typeof item.Description === 'string'
      && Number.isInteger(item.ChangeValue)
      && Number.isInteger(item.UseCount)
      && (item.UseCount as number) >= 1
      && Number.isInteger(item.TargetRange)
      && (item.TargetRange as number) >= 0
      && Number.isInteger(item.UsageRange)
      && (item.UsageRange as number) >= 0
      && this.isEnumValue(ItemType, item.ItemType)
      && this.isEnumValue(TargetType, item.TargetType);
  }

  private isEnumValue(enumType: object, value: unknown): value is number {
    return typeof value === 'number' && Object.values(enumType).includes(value);
  }
}
