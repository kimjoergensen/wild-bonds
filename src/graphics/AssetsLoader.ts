import { Spriteset } from '@wild-bonds/types/graphics/Spriteset';
import { Tile } from '@wild-bonds/types/graphics/Tile';
import { Tileset } from '@wild-bonds/types/graphics/Tileset';
import { Assets, Sprite, Spritesheet } from 'pixi.js';

export class AssetsLoader {
  private readonly spritesheets = {} as Record<Tileset, Spritesheet>;
  private readonly animationSpritesheets = {} as Record<Spriteset, Spritesheet>;
  private readonly creatureTextures = {} as Record<string, any>;
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

      // Load creature sprites
      await this.loadCreatureSprites();

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

  public getCreatureTexture(creatureName: string): any {
    if (!this.isLoaded) {
      throw new Error('Assets not loaded yet. Call loadAssets() first.');
    }

    const texture = this.creatureTextures[creatureName];
    if (!texture) {
      throw new Error(`Creature texture not found: ${creatureName}`);
    }

    return texture;
  }

  private async loadCreatureSprites(): Promise<void> {
    const creatureSprites = [
      // Enemies
      { name: 'slime_green', path: '/sprites/enemies/Slime_Green.png' },
      { name: 'skeleton', path: '/sprites/enemies/Skeleton.png' },
      // Animals
      { name: 'sheep', path: '/sprites/animals/Sheep.png' },
      { name: 'pig', path: '/sprites/animals/Pig.png' },
      { name: 'cow', path: '/sprites/animals/Cow.png' },
      { name: 'chicken', path: '/sprites/animals/Chicken.png' }
    ];

    for (const sprite of creatureSprites) {
      try {
        this.creatureTextures[sprite.name] = await Assets.load(sprite.path);
        console.log(`Loaded creature sprite: ${sprite.name}`);
      } catch (error) {
        console.error(`Failed to load creature sprite ${sprite.name}:`, error);
      }
    }
  }
}