import { Item } from '../models/item.model';

export interface ItemState {
  currentItem: Item | null;
}

const createDefaultItem = (): Item => {
  const item = new Item();
    item.ID = 1;
    item.ItemType = 0;
    item.UseCount = 1;
    item.ChangeValue = 0;
    item.ParentEntity = null;
    item.TargetEntity = null;
  return item;
};

export const initialItemState: ItemState = {
  currentItem: createDefaultItem()
};
