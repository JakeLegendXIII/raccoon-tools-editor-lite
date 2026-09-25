import { describe, expect, it } from 'vitest';

import { Item, ItemType, TargetType } from '../models/item.model';
import { initialItemState } from './items.state';

describe('initialItemState', () => {
  it('starts with no items and a default current item', () => {
    expect(initialItemState.items).toEqual([]);
    expect(initialItemState.currentItem).toBeInstanceOf(Item);
    expect(initialItemState.currentItem).toMatchObject({
      ID: 1,
      Name: '',
      Description: '',
      ItemType: ItemType.Attack,
      TargetType: TargetType.Self,
      UseCount: 1,
      ChangeValue: 0,
      TargetRange: 0,
      UsageRange: 0
    });
  });
});