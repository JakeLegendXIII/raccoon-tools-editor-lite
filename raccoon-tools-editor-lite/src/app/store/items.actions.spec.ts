import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { Item } from '../models/item.model';
import * as ItemsActions from './items.actions';

describe('item actions', () => {
  const item = Object.assign(new Item(), { ID: 2, Name: 'Potion' });

  it.each([
    [ItemsActions.loadItems({ items: [item] }), '[Items] Load Items', { items: [item] }],
    [ItemsActions.addItem({ item }), '[Level] Add Item', { item }],
    [ItemsActions.updateItem({ item }), '[Level] Update Item', { item }],
    [ItemsActions.deleteItem({ itemId: 2 }), '[Level] Delete Item', { itemId: 2 }]
  ])('creates %s with the expected type and payload', (action, type, payload) => {
    expect(action).toEqual({ type, ...payload });
  });
});