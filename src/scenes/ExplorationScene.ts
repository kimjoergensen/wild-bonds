import { GAME_CONFIG } from '@wild-bonds/configs/Constants';
import { Scene } from '@wild-bonds/core/Scene';
import { Tile } from '@wild-bonds/types/graphics/Tile';
import { Container } from 'pixi.js';

export class ExplorationScene extends Scene {
  // TODO: Figure out a better way to manage tile maps
  private tile_map: Tile[][] = [
    ['path_nw', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_ne'],
    ['path_w', 'path', 'path_1', 'path', 'path', 'path', 'path', 'path', 'path_2', 'path', 'path', 'path_e'],
    ['path_w', 'path', 'path_corner_nw', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_corner_ne', 'path', 'path_e'],
    ['path_w', 'path', 'path_e', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_w', 'path', 'path_e'],
    ['path_w', 'path', 'path_e', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_w', 'path', 'path_e'],
    ['path_w', 'path', 'path_e', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_w', 'path', 'path_e'],
    ['path_w', 'path', 'path_corner_sw', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_n', 'path_corner_se', 'path', 'path_e'],
    ['path_w', 'path', 'path', 'path', 'path_2', 'path', 'path', 'path', 'path', 'path_1', 'path', 'path_e'],
    ['path_sw', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_s', 'path_se'],
  ];

  public async init(container: Container): Promise<void> {
    try {
      // Draw tile map
      for (let row = 0; row < this.tile_map.length; row++) {
        for (let col = 0; col < this.tile_map[row].length; col++) {
          const tile = this.tile_map[row][col];
          const sprite = this.assetsLoader.getSprite(tile.startsWith('grass') ? 'grass' : 'path', tile);
          sprite.width = GAME_CONFIG.tileSize;
          sprite.height = GAME_CONFIG.tileSize;
          sprite.x = col * GAME_CONFIG.tileSize;
          sprite.y = row * GAME_CONFIG.tileSize;
          container.addChild(sprite);
        }
      }
    } catch (e) {
      console.error('ExplorationScene init failed:', e, e && (e as any).message, e && (e as any).stack);
      throw e;
    }
  }

  cleanup(): void {
    console.log('Cleaning up exploration scene...');
  }
}