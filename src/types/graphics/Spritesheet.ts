import { Spriteset } from './Spriteset';
import { Tileset } from './Tileset';

export type Spritesheet<T extends Tileset | Spriteset> = {
  [key in T]: string;
};