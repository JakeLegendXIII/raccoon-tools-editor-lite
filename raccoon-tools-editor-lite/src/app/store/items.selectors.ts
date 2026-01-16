import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ItemState } from './items.state';

export const selectItemState = createFeatureSelector<ItemState>('item');

export const selectCurrentItem = createSelector(
  selectItemState,
  (state) => state.currentItem
);