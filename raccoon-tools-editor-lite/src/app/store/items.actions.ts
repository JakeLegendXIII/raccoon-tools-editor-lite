import { createAction, props } from '@ngrx/store';
import { Item } from '../models/item.model';

export const loadItems = createAction(
  '[Items] Load Items',
  props<{ items: Item[] }>()
);

export const addItem = createAction(
  '[Level] Add Item',
  props<{ item: Item }>()
);

export const updateItem = createAction(
  '[Level] Update Item',
  props<{ item: Item }>()
);

export const deleteItem = createAction(
  '[Level] Delete Item',
  props<{ itemId: number }>()
);