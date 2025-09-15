import { Tileset } from './Tileset';

export type Tilesheet<T extends Tileset> = {
  [key in T]: string;
};