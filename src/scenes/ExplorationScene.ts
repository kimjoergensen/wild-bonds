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


      const grass_nw = new Sprite(sheet.textures['grass_nw']);
      grass_nw.x = 0; grass_nw.y = 0;

      const grass_n = new Sprite(sheet.textures['grass_n']);
      grass_n.x = 16; grass_n.y = 0;

      console.log(this.tile_map.length);
      for (let row = 0; row < this.tile_map.length; row++) {
        for (let col = 0; col < this.tile_map[row].length; col++) {
          const tile = this.tile_map[row][col];
          const sprite = tile === 'grass' ? new Sprite(grassMiddle) : new Sprite(sheet.textures[tile]);
          sprite.x = col * 16;
          sprite.y = row * 16;
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