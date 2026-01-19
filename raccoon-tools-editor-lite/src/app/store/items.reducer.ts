import { createReducer, on, State } from '@ngrx/store';
import { ItemState, initialItemState } from './items.state';
import * as ItemsActions from './items.actions';

export const itemsReducer = createReducer(
  initialItemState,
  on(ItemsActions.loadItems, (state, { items }) => ({
    ...state,
    items: items
  })),
  on(ItemsActions.addItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
    currentItem: item
  })),
    on(ItemsActions.updateItem, (state, { item }) => ({
    ...state,
    currentItem: state.currentItem && state.currentItem.ID === item.ID ? item : state.currentItem
  })),
    on(ItemsActions.deleteItem, (state, { itemId }) => ({
    ...state,
    currentItem: state.currentItem && state.currentItem.ID === itemId ? null : state.currentItem
  }))
);