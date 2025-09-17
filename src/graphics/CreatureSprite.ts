import { Sprite } from 'pixi.js';
import { AssetsLoader } from './AssetsLoader';

export interface CreatureSpriteConfig {
  creatureName: string;
  x: number;
  y: number;
  scale?: number;
  flipX?: boolean;
}

export class CreatureSprite extends Sprite {
  private creatureName: string;

  constructor(config: CreatureSpriteConfig, assetsLoader: AssetsLoader) {
    const texture = assetsLoader.getCreatureTexture(config.creatureName);
    super(texture);

    this.creatureName = config.creatureName;

    // Set position
    this.x = config.x;
    this.y = config.y;

    // Set scale (default to 1 if not provided)
    const scale = config.scale ?? 1;
    this.scale.set(scale);

    // Handle horizontal flipping (useful for enemy vs player positioning)
    if (config.flipX) {
      this.scale.x *= -1;
    }

    // Center anchor point for better positioning
    this.anchor.set(0.5);
  }

  public getCreatureName(): string {
    return this.creatureName;
  }

  public updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public updateScale(scale: number): void {
    const isFlipped = this.scale.x < 0;
    this.scale.set(scale);
    if (isFlipped) {
      this.scale.x *= -1;
    }
  }

  public setFlipped(flipped: boolean): void {
    const currentScale = Math.abs(this.scale.x);
    this.scale.x = flipped ? -currentScale : currentScale;
  }
}