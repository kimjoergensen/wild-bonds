import { Scene } from '@wild-bonds/core/Scene';
import { Assets, Container, Sprite } from 'pixi.js';

type PathTile = 'path_nw' | 'path_n' | 'path_ne' | 'path_w' | 'path_e' | 'path_sw' | 'path_s' | 'path_se' | 'path_corner_nw' | 'path_corner_ne' | 'path_corner_sw' | 'path_corner_se' | 'path' | 'path_1' | 'path_2' | 'path_3';
type GrassTile = 'grass_nw' | 'grass_n' | 'grass_ne' | 'grass_w' | 'grass_e' | 'grass_sw' | 'grass_s' | 'grass_se' | 'grass_corner_nw' | 'grass_corner_ne' | 'grass_corner_sw' | 'grass_corner_se' | 'grass' | 'grass_1' | 'grass_2' | 'grass_3';

export class ExplorationScene extends Scene {
  private tile_map: (PathTile | GrassTile)[][] = [
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

  private tileSize: number = 16;

  constructor(tileSize: number = 16) {
    super();
    this.tileSize = tileSize;
  }


  public async init(container: Container): Promise<void> {
    try {
      const pathTileset = await Assets.load('/tilesets/Tiles/Path_Tileset.png');
      const grassMiddle = await Assets.load('/tilesets/Tiles/Grass_Tileset.png');

      Assets.add({
        alias: 'path_tilesheet',
        src: '/tilesets/Tiles/Path_Tilesheet.json',
        data: { texture: pathTileset }
      });

      Assets.add({
        alias: 'grass_tilesheet',
        src: '/tilesets/Tiles/Grass_Tilesheet.json',
        data: { texture: grassMiddle }
      });

      const pathSheet = await Assets.load('path_tilesheet');
      const grassSheet = await Assets.load('grass_tilesheet');

      // Draw tile map
      for (let row = 0; row < this.tile_map.length; row++) {
        for (let col = 0; col < this.tile_map[row].length; col++) {
          const tile = this.tile_map[row][col];
          const sprite = new Sprite(tile.startsWith('grass') ? grassSheet.textures[tile] : pathSheet.textures[tile]);
          sprite.width = this.tileSize;
          sprite.height = this.tileSize;
          sprite.x = col * this.tileSize;
          sprite.y = row * this.tileSize;
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