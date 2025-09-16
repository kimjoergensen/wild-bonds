import { Spriteset } from '@wild-bonds/types/graphics/Spriteset';
import { Tile } from '@wild-bonds/types/graphics/Tile';
import { Tileset } from '@wild-bonds/types/graphics/Tileset';
import { Assets, Sprite, Spritesheet } from 'pixi.js';

export class AssetsLoader {
  private readonly spritesheets = {} as Record<Tileset, Spritesheet>;
  private readonly animationSpritesheets = {} as Record<Spriteset, Spritesheet>;
  private isLoaded = false;

  async loadAssets(): Promise<void> {
    try {
      // Load the tilesets and tilesheets here
      this.spritesheets['grass'] = await this.loadSpritesheet('grass',
        '/tilesets/tiles/Grass.png', '/tilesets/tiles/Grass_Spritesheet.json');

      this.spritesheets['path'] = await this.loadSpritesheet('path',
        '/tilesets/tiles/Path.png', '/tilesets/tiles/Path_Spritesheet.json');

      // Load player animations
      this.animationSpritesheets['player'] = await this.loadAnimationSpritesheet('player',
        '/sprites/player/Player.png', '/sprites/player/Player.json');

      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
    }
  }

  public getSprite<T extends Tileset>(type: T, tile: Tile): Sprite {
    if (!this.isLoaded) {
      throw new Error('Assets not loaded yet. Call loadAssets() first.');
    }

    const texture = this.spritesheets[type].textures[tile];
    if (!texture) {
      throw new Error(`Texture not found for tile key: ${tile}`);
    }

    return new Sprite(texture);
  }

  public getAnimationSpritesheet<T extends Spriteset>(type: T): Spritesheet {
    if (!this.isLoaded) {
      throw new Error('Assets not loaded yet. Call loadAssets() first.');
    }

    const spritesheet = this.animationSpritesheets[type];
    if (!spritesheet) {
      throw new Error(`Animation spritesheet not found for type: ${type}`);
    }

    return spritesheet;
  }

  private async loadSpritesheet(tileset: Tileset, texturePath: string, spritesheetPath: string): Promise<Spritesheet> {
    try {
      const texture = await Assets.load(texturePath);
      const spritesheet = await Assets.load(spritesheetPath);

      Assets.add({
        alias: `${tileset}_tilesheet`,
        src: spritesheetPath,
        data: { texture }
      });

      return spritesheet;
    } catch (error) {
      console.error(`Error loading tileset spritesheet for ${tileset}:`, error);
      throw error;
    }
  }

  private async loadAnimationSpritesheet(spriteset: Spriteset, texturePath: string, spritesheetPath: string): Promise<Spritesheet> {
    try {
      console.log(`Loading animation spritesheet: ${spriteset} from ${texturePath} and ${spritesheetPath}`);

      const texture = await Assets.load(texturePath);

      // Load the JSON data directly with fetch instead of Assets.load
      const response = await fetch(spritesheetPath);
      const spritesheetData = await response.json();

      console.log('Texture loaded successfully');
      console.log('Spritesheet JSON data loaded successfully');
      console.log('Spritesheet data meta:', spritesheetData.meta ? 'exists' : 'undefined');

      // Ensure scale is a number if it exists
      if (spritesheetData.meta && typeof spritesheetData.meta.scale === 'string') {
        spritesheetData.meta.scale = parseFloat(spritesheetData.meta.scale);
      }

      // Create a new Spritesheet instance with the loaded texture and data
      const spritesheet = new Spritesheet(texture, spritesheetData);
      await spritesheet.parse();

      console.log('Spritesheet parsed successfully, animation count:', Object.keys(spritesheet.animations).length);

      Assets.add({
        alias: `${spriteset}_animations`,
        src: spritesheetPath,
        data: { texture }
      });

      return spritesheet;
    } catch (error) {
      console.error(`Error loading animation spritesheet for ${spriteset}:`);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }
}