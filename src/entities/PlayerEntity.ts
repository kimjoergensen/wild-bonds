import { InputManager } from '@wild-bonds/systems/InputManager';
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

  update(deltaTime: number, inputManager: InputManager): void {
    this.#moveTimer += deltaTime;

    // Only allow movement if enough time has passed
    if (this.#moveTimer >= this.#moveDelay) {
      const movement = inputManager.isMovementPressed();

      if (movement.x !== 0 || movement.y !== 0) {
        // Update direction based on input
        if (movement.x > 0) this.#direction = 'right';
        else if (movement.x < 0) this.#direction = 'left';
        else if (movement.y > 0) this.#direction = 'down';
        else if (movement.y < 0) this.#direction = 'up';

        // Move player
        this.#position.x += movement.x;
        this.#position.y += movement.y;

        // Update sprite position
        if (this.#sprite) {
          const pos: Vector2 = this.#position;
          this.#sprite.x = pos.x * this.#tileSize;
          this.#sprite.y = pos.y * this.#tileSize;
        }

        // Boundary checking (simple for now)
        this.#position.x = Math.max(0, Math.min(9, this.#position.x)); // 10x8 grid
        this.#position.y = Math.max(0, Math.min(7, this.#position.y));

        this.#moveTimer = 0;
      }
    }
  }
}