import { Scene } from '@wild-bonds/core/Scene';
import { Assets, Container, Sprite } from 'pixi.js';

type PathTile = 'grass_nw' | 'grass_n' | 'grass_ne' | 'grass_w' | 'grass_e' | 'grass_sw' | 'grass_s' | 'grass_se' | 'dirt_nw' | 'dirt_ne' | 'dirt_sw' | 'dirt_se' | 'dirt' | 'dirt_1' | 'dirt_2' | 'dirt_3';
type GrassMiddle = 'grass';

export class ExplorationScene extends Scene {
  private tile_map: (PathTile | GrassMiddle)[][] = [
    ['grass_nw', 'grass_n', 'grass_n', 'grass_n', 'grass_n', 'grass_n', 'grass_n', 'grass_n', 'grass_n', 'grass_ne'],
    ['grass_w', 'dirt', 'dirt_1', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'grass_e'],
    ['grass_w', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt_2', 'dirt', 'dirt', 'dirt', 'grass_e'],
    ['grass_w', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'grass_e'],
    ['grass_w', 'dirt', 'dirt', 'dirt_1', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'grass_e'],
    ['grass_w', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt_1', 'grass_e'],
    ['grass_w', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt_2', 'dirt', 'dirt', 'grass_e'],
    ['grass_sw', 'grass_s', 'grass_s', 'grass_s', 'grass_s', 'grass_s', 'grass_s', 'grass_s', 'grass_s', 'grass_se'],
  ];

  private tileSize: number = 16;

  constructor(tileSize: number = 16) {
    super();
    this.tileSize = tileSize;
  }


  public async init(container: Container): Promise<void> {
    try {
      const pathTileset = await Assets.load('/tilesets/Tiles/Path_Tileset.png');
      const grassMiddle = await Assets.load('/tilesets/Tiles/Grass_Middle.png');

      Assets.add({
        alias: 'path_tilesheet',
        src: '/tilesets/Tiles/Path_Tilesheet.json',
        data: { texture: pathTileset }
      });

      const sheet = await Assets.load('path_tilesheet');

      // Draw tile map
      for (let row = 0; row < this.tile_map.length; row++) {
        for (let col = 0; col < this.tile_map[row].length; col++) {
          const tile = this.tile_map[row][col];
          const sprite = tile === 'grass' ? new Sprite(grassMiddle) : new Sprite(sheet.textures[tile]);
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