import { PlayerGraphicsController } from '@wild-bonds/graphics/PlayerGraphicsController';
import { Direction } from '@wild-bonds/types/common/Direction';
import { Vector2 } from '@wild-bonds/types/common/Vector2';
import { AnimatedSprite, Spritesheet } from 'pixi.js';


export class PlayerEntity {
  private graphicsController: PlayerGraphicsController;
  private position: Vector2; // logical grid position
  private pixelPosition: Vector2; // actual rendered position (pixels)
  private moveTarget: Vector2 | null = null; // pixel target for smooth movement
  private direction: Direction;
  private speed: number; // tiles per second
  private tileSize: number;
  private isMoving: boolean = false;
  private stepCooldown: number = 0; // seconds

  constructor(startPosition: Vector2, tileSize: number) {
    this.graphicsController = new PlayerGraphicsController(tileSize);
    this.position = { ...startPosition };
    this.pixelPosition = {
      x: startPosition.x * tileSize,
      y: startPosition.y * tileSize
    };
    this.direction = 'down';
    this.speed = 4; // tiles per second
    this.tileSize = tileSize;
    this.stepCooldown = 0;
  }

  /**
   * Updates the player's position and state.
   * @param deltaTime Time elapsed since the last update.
   * @param direction Direction the player is moving in.
   */
  public update(deltaTime: number, direction: Direction | null): void {
    // Step cooldown timer
    if (this.stepCooldown > 0) {
      this.stepCooldown -= deltaTime;
      if (this.stepCooldown < 0) this.stepCooldown = 0;
    }

    // If currently moving, interpolate pixel position toward moveTarget
    if (this.moveTarget) {
      const speedPx = this.speed * this.tileSize; // pixels per second
      const dx = this.moveTarget.x - this.pixelPosition.x;
      const dy = this.moveTarget.y - this.pixelPosition.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const moveDist = Math.min(speedPx * deltaTime, dist);
        this.pixelPosition.x += (dx / dist) * moveDist;
        this.pixelPosition.y += (dy / dist) * moveDist;
      }
      // Snap to target if close enough
      if (dist < 0.5) {
        this.pixelPosition.x = this.moveTarget.x;
        this.pixelPosition.y = this.moveTarget.y;
        this.moveTarget = null;
        this.stepCooldown = 0.06; // 60ms pause between steps
      }
    }

    // If not currently moving and input is given, start a new move
    if (!this.moveTarget && this.stepCooldown === 0 && direction != null) {
      // Calculate movement vector
      const movement = this.calculateMovementVector(direction);
      const newX = this.position.x + movement.x;
      const newY = this.position.y + movement.y;
      // Boundary checking (simple for now)
      if (newX >= 0 && newX <= 11 && newY >= 0 && newY <= 8) {
        this.direction = direction;
        this.position.x = newX;
        this.position.y = newY;
        this.moveTarget = {
          x: this.position.x * this.tileSize,
          y: this.position.y * this.tileSize
        };
      }
    }

    // Determine if player is moving (pixel position not at logical position)
    // Keep run animation during stepCooldown if input is held
    if (this.moveTarget) {
      this.isMoving = true;
    } else if (this.stepCooldown > 0 && direction != null) {
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }

    // Update sprite position to current pixel position
    this.graphicsController.setPosition(this.pixelPosition.x, this.pixelPosition.y);

    // Update animation
    this.graphicsController.updateAnimation(this.isMoving, this.direction);
  }

  public initializeGraphics(spritesheet: Spritesheet): void {
    this.graphicsController.initialize(spritesheet);
    this.graphicsController.setPosition(
      this.pixelPosition.x,
      this.pixelPosition.y
    );
  }

  public getSprite(): AnimatedSprite | null {
    return this.graphicsController.getSprite();
  }

  private calculateMovementVector(direction: Direction): Vector2 {
    const movement: Vector2 = { x: 0, y: 0 };

    switch (direction) {
      case 'up':
        movement.y = -1;
        break;
      case 'down':
        movement.y = 1;
        break;
      case 'left':
        movement.x = -1;
        break;
      case 'right':
        movement.x = 1;
    }

    return movement;
  }
}