import { Tile } from '@wild-bonds/types/graphics/Tile';
import { Tileset } from '@wild-bonds/types/graphics/Tileset';
import { Assets, Sprite, Spritesheet } from 'pixi.js';

export class AssetsLoader {
  private readonly spritesheets = {} as Record<Tileset, Spritesheet>;
  private isLoaded = false;

  async loadAssets(): Promise<void> {
    // Load the tilesets and tilesheets here
    this.spritesheets['grass'] = await this.#loadTilesheet('grass',
      '/tilesets/Tiles/Grass_Tileset.png', '/tilesets/Tiles/Grass_Tilesheet.json');

    this.spritesheets['path'] = await this.#loadTilesheet('path',
      '/tilesets/Tiles/Path_Tileset.png', '/tilesets/Tiles/Path_Tilesheet.json');

    this.isLoaded = true;
  }

  getSprite<T extends Tileset>(type: T, tile: Tile): Sprite {
    if (!this.isLoaded) {
      throw new Error('Assets not loaded yet. Call loadAssets() first.');
    }

    const texture = this.spritesheets[type].textures[tile];
    if (!texture) {
      throw new Error(`Texture not found for tile key: ${tile}`);
    }

    return new Sprite(texture);
  }

  async #loadTilesheet(tileset: Tileset, tilesetPath: string, spritesheetPath: string): Promise<Spritesheet> {
    const texture = await Assets.load(tilesetPath);
    const spritesheet = await Assets.load(spritesheetPath);

    Assets.add({
      alias: `${tileset}_tilesheet`,
      src: spritesheetPath,
      data: { texture }
    });

    return spritesheet;
  }
}