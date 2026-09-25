import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { Item } from '../models/item.model';
import * as ItemsActions from './items.actions';
import { itemsReducer } from './items.reducer';
import { initialItemState, ItemState } from './items.state';

describe('itemsReducer', () => {
  const createItem = (id: number, name: string): Item =>
    Object.assign(new Item(), { ID: id, Name: name });

  it('returns the initial state for an unknown action', () => {
    expect(itemsReducer(undefined, { type: 'unknown' })).toBe(initialItemState);
  });

  it('replaces loaded items without changing the current item', () => {
    const state: ItemState = {
      items: [createItem(1, 'Old')],
      currentItem: createItem(1, 'Selected')
    };
    const items = [createItem(2, 'New')];

    const result = itemsReducer(state, ItemsActions.loadItems({ items }));

    expect(result.items).toBe(items);
    expect(result.currentItem).toBe(state.currentItem);
    expect(state.items).toHaveLength(1);
  });

  it('appends an item and selects it without mutating the previous list', () => {
    const state: ItemState = { items: [createItem(1, 'First')], currentItem: null };
    const item = createItem(2, 'Second');

    const result = itemsReducer(state, ItemsActions.addItem({ item }));

    expect(result.items).toEqual([state.items[0], item]);
    expect(result.currentItem).toBe(item);
    expect(state.items).toHaveLength(1);
  });

  it('updates matching items and the current item by ID', () => {
    const selected = createItem(1, 'Before');
    const other = createItem(2, 'Other');
    const state: ItemState = { items: [selected, other], currentItem: selected };
    const updated = createItem(1, 'After');

    const result = itemsReducer(state, ItemsActions.updateItem({ item: updated }));

    expect(result.items).toEqual([updated, other]);
    expect(result.items[1]).toBe(other);
    expect(result.currentItem).toBe(updated);
    expect(state.items[0]).toBe(selected);
  });

  it('does not change the current item when updating another ID', () => {
    const selected = createItem(1, 'Selected');
    const updated = createItem(2, 'Updated');
    const state: ItemState = { items: [selected, createItem(2, 'Before')], currentItem: selected };

    const result = itemsReducer(state, ItemsActions.updateItem({ item: updated }));

    expect(result.items).toEqual([selected, updated]);
    expect(result.currentItem).toBe(selected);
  });

  it('deletes matching items and clears the current item only when it matches', () => {
    const selected = createItem(1, 'Selected');
    const other = createItem(2, 'Other');
    const state: ItemState = { items: [selected, other], currentItem: selected };

    const deleteOther = itemsReducer(state, ItemsActions.deleteItem({ itemId: 2 }));
    const deleteSelected = itemsReducer(state, ItemsActions.deleteItem({ itemId: 1 }));

    expect(deleteOther.items).toEqual([selected]);
    expect(deleteOther.currentItem).toBe(selected);
    expect(deleteSelected.items).toEqual([other]);
    expect(deleteSelected.currentItem).toBeNull();
    expect(state.items).toEqual([selected, other]);
  });
});