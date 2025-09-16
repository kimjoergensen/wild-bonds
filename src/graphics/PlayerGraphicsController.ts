
import { Direction } from '@wild-bonds/types/common/Direction';
import { PlayerAnimation, PlayerAnimationState } from '@wild-bonds/types/graphics/PlayerAnimation';
import { AnimatedSprite, Spritesheet } from 'pixi.js';

/**
 * Handles all player animation and flipping logic.
 */

export class PlayerGraphicsController {
  private sprite: AnimatedSprite | null = null;
  private spritesheet: Spritesheet | null = null;
  private tileSize: number;
  private lastAnim: PlayerAnimation | null = null;

  constructor(tileSize: number) {
    this.tileSize = tileSize;
  }

  /**
   * Initialize with the player spritesheet.
   */
  public initialize(spritesheet: Spritesheet): void {
    this.spritesheet = spritesheet;
    const anim = this.getAnimName('idle', 'down');
    this.sprite = new AnimatedSprite(spritesheet.animations[anim]);
    this.sprite.width = this.tileSize;
    this.sprite.height = this.tileSize;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
    this.lastAnim = anim;
  }

  /**
   * Update animation and flipping every frame.
   */
  /**
   * Update animation and flipping every frame.
   */
  public updateAnimation(isMoving: boolean, direction: Direction): void {
    if (!this.sprite || !this.spritesheet) return;

    const state: PlayerAnimationState = isMoving ? 'run' : 'idle';
    const animDir = this.animDirection(direction);
    const anim = this.getAnimName(state, animDir);

    // Switch animation if needed
    if (anim !== this.lastAnim) {
      this.sprite.textures = this.spritesheet.animations[anim];
      this.sprite.play();
      this.lastAnim = anim;
    }

    // Always set flip based on direction
    this.sprite.scale.x = (animDir === 'side' && direction === 'left') ? -1 : 1;
  }

  /**
   * Set the sprite's position (centered on tile).
   */
  /**
   * Set the sprite's position (centered on tile).
   */
  public setPosition(x: number, y: number): void {
    if (this.sprite) {
      this.sprite.x = x + this.tileSize / 2;
      this.sprite.y = y + this.tileSize / 2;
    }
  }

  /**
   * Get the current AnimatedSprite.
   */
  public getSprite(): AnimatedSprite | null {
    return this.sprite;
  }

  /**
   * Helper: Get animation name.
   */
  private getAnimName(state: PlayerAnimationState, dir: 'up' | 'down' | 'side'): PlayerAnimation {
    return `${state}_${dir}` as PlayerAnimation;
  }

  /**
   * Helper: Map direction to animation direction.
   */
  private animDirection(dir: Direction): 'up' | 'down' | 'side' {
    if (dir === 'up' || dir === 'down') return dir;
    return 'side';
  }
}