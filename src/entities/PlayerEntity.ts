import { Direction } from '@wild-bonds/types/common/Direction';
import { Vector2 } from '@wild-bonds/types/common/Vector2';
import { Sprite } from 'pixi.js';

export class PlayerEntity {
  #sprite: Sprite | null = null;
  #position: Vector2;
  #direction: Direction;
  #speed: number;
  #tileSize: number;

  #moveTimer: number;
  #moveDelay: number;

  /**
   * Current position of the player in tile coordinates.
   */
  get position(): Vector2 {
    return this.#position;
  }

  get direction(): Direction {
    return this.#direction;
  }

  set sprite(sprite: Sprite) {
    this.#sprite = sprite;
    this.#sprite.width = this.#tileSize;
    this.#sprite.height = this.#tileSize;
    this.#sprite.x = this.#position.x * this.#tileSize;
    this.#sprite.y = this.#position.y * this.#tileSize;
  }

  constructor(startPosition: Vector2, tileSize: number) {
    this.#position = startPosition;
    this.#direction = 'down';
    this.#speed = 4; // tiles per second
    this.#moveTimer = 0;
    this.#moveDelay = 1 / this.#speed; // seconds between moves
    this.#tileSize = tileSize;
  }

  /**
   * Updates the player's position and state.
   * @param deltaTime Time elapsed since the last update.
   * @param direction Direction the player is moving in.
   */
  update(deltaTime: number, direction: Direction | null): void {
    this.#moveTimer += deltaTime;

    // Only allow movement if enough time has passed
    if (this.#moveTimer >= this.#moveDelay) {

      if (direction != null) {
        // Update direction based on input
        this.#direction = direction;

        // Calculate movement vector
        const movement = this.#calculateMovementVector(direction);

        // Move player
        this.#position.x += movement.x;
        this.#position.y += movement.y;

        // Boundary checking (simple for now)
        this.#position.x = Math.max(0, Math.min(11, this.#position.x)); // 12x9 grid
        this.#position.y = Math.max(0, Math.min(8, this.#position.y));

        // Update sprite position
        if (this.#sprite) {
          const pos: Vector2 = this.#position;
          this.#sprite.x = pos.x * this.#tileSize;
          this.#sprite.y = pos.y * this.#tileSize;
        }

        this.#moveTimer = 0;
      }
    }
  }

  #calculateMovementVector(direction: Direction): Vector2 {
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