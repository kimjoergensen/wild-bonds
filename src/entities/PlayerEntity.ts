import { InputManager } from '@wild-bonds/systems/InputManager';
import { Direction } from '@wild-bonds/types/common/Direction';
import { Vector2 } from '@wild-bonds/types/common/Vector2';

export class PlayerEntity {
  private position: Vector2;
  private direction: Direction;
  private speed: number;
  private moveTimer: number;
  private moveDelay: number;
  private tileSize: number;

  constructor(startPosition: Vector2, tileSize: number) {
    this.position = { ...startPosition };
    this.direction = 'down';
    this.speed = 4; // tiles per second
    this.moveTimer = 0;
    this.moveDelay = 1 / this.speed; // seconds between moves
    this.tileSize = tileSize;
  }

  update(deltaTime: number, inputManager: InputManager): void {
    this.moveTimer += deltaTime;

    // Only allow movement if enough time has passed
    if (this.moveTimer >= this.moveDelay) {
      const movement = inputManager.isMovementPressed();

      if (movement.x !== 0 || movement.y !== 0) {
        // Update direction based on input
        if (movement.x > 0) this.direction = 'right';
        else if (movement.x < 0) this.direction = 'left';
        else if (movement.y > 0) this.direction = 'down';
        else if (movement.y < 0) this.direction = 'up';

        // Move player
        this.position.x += movement.x;
        this.position.y += movement.y;

        // Boundary checking (simple for now)
        this.position.x = Math.max(0, Math.min(24, this.position.x)); // 25x19 grid
        this.position.y = Math.max(0, Math.min(18, this.position.y));

        this.moveTimer = 0;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const pixelX = this.position.x * this.tileSize;
    const pixelY = this.position.y * this.tileSize;

    // Draw simple player representation (will be replaced with sprite later)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(pixelX + 2, pixelY + 2, this.tileSize - 4, this.tileSize - 4);

    // Draw direction indicator
    ctx.fillStyle = '#2E7D32';
    const centerX = pixelX + this.tileSize / 2;
    const centerY = pixelY + this.tileSize / 2;
    const indicatorSize = 3;

    switch (this.direction) {
      case 'up':
        ctx.fillRect(centerX - indicatorSize / 2, pixelY + 2, indicatorSize, 4);
        break;
      case 'down':
        ctx.fillRect(centerX - indicatorSize / 2, pixelY + this.tileSize - 6, indicatorSize, 4);
        break;
      case 'left':
        ctx.fillRect(pixelX + 2, centerY - indicatorSize / 2, 4, indicatorSize);
        break;
      case 'right':
        ctx.fillRect(pixelX + this.tileSize - 6, centerY - indicatorSize / 2, 4, indicatorSize);
        break;
    }
  }

  getPosition(): Vector2 {
    return { ...this.position };
  }

  getDirection(): Direction {
    return this.direction;
  }

  setPosition(position: Vector2): void {
    this.position = { ...position };
  }
}