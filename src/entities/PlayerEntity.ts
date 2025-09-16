import { PlayerGraphicsController } from '@wild-bonds/graphics/PlayerGraphicsController';
import { Direction } from '@wild-bonds/types/common/Direction';
import { Vector2 } from '@wild-bonds/types/common/Vector2';
import { AnimatedSprite, Spritesheet } from 'pixi.js';

export class PlayerEntity {
  private graphicsController: PlayerGraphicsController;
  private position: Vector2;
  private direction: Direction;
  private speed: number;
  private tileSize: number;

  private moveTimer: number;
  private moveDelay: number;
  private isMoving: boolean = false;

  constructor(startPosition: Vector2, tileSize: number) {
    this.graphicsController = new PlayerGraphicsController(tileSize);
    this.position = startPosition;
    this.direction = 'down';
    this.speed = 4; // tiles per second
    this.moveTimer = 0;
    this.moveDelay = 1 / this.speed; // seconds between moves
    this.tileSize = tileSize;
  }

  /**
   * Updates the player's position and state.
   * @param deltaTime Time elapsed since the last update.
   * @param direction Direction the player is moving in.
   */
  public update(deltaTime: number, direction: Direction | null): void {
    this.moveTimer += deltaTime;

    // Determine if player is moving
    this.isMoving = direction !== null;

    // Only allow movement if enough time has passed
    if (this.moveTimer >= this.moveDelay) {

      if (direction != null) {
        // Update direction based on input
        this.direction = direction;

        // Calculate movement vector
        const movement = this.calculateMovementVector(direction);

        // Move player
        this.position.x += movement.x;
        this.position.y += movement.y;

        // Boundary checking (simple for now)
        this.position.x = Math.max(0, Math.min(11, this.position.x)); // 12x9 grid
        this.position.y = Math.max(0, Math.min(8, this.position.y));

        // Update sprite position
        this.graphicsController.setPosition(
          this.position.x * this.tileSize,
          this.position.y * this.tileSize
        );

        this.moveTimer = 0;
      }
    }

    // Update animation regardless of movement timer
    this.graphicsController.updateAnimation(this.isMoving, this.direction);
  }

  public initializeGraphics(spritesheet: Spritesheet): void {
    this.graphicsController.initialize(spritesheet);
    this.graphicsController.setPosition(
      this.position.x * this.tileSize,
      this.position.y * this.tileSize
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