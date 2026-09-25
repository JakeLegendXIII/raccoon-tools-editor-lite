import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { Item } from '../models/item.model';
import * as ItemsSelectors from './items.selectors';
import { ItemState } from './items.state';

describe('item selectors', () => {
  it('reads the item feature and exposes its list and current item', () => {
    const selected = Object.assign(new Item(), { ID: 2 });
    const state: ItemState = { items: [new Item(), selected], currentItem: selected };
    const root = { item: state };

    expect(ItemsSelectors.selectItemState(root)).toBe(state);
    expect(ItemsSelectors.selectItems(root)).toBe(state.items);
    expect(ItemsSelectors.selectCurrentItem(root)).toBe(selected);
  });

  it('returns an empty list and null current item from empty state', () => {
    const state: ItemState = { items: [], currentItem: null };
    const root = { item: state };

    expect(ItemsSelectors.selectItems(root)).toBe(state.items);
    expect(ItemsSelectors.selectCurrentItem(root)).toBeNull();
  });
});