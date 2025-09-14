import { ItemType } from './ItemType';

export interface Item {
  id: string;
  name: string;
  quantity: number;
  type: ItemType;
}