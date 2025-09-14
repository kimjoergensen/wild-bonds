import { Game } from '@wild-bonds/core/Game';
import { Scene } from '@wild-bonds/core/Scene';
import { PlayerEntity } from '@wild-bonds/entities/PlayerEntity';
import { RenderContext } from '@wild-bonds/types/common/RenderContext';
import { UpdateContext } from '@wild-bonds/types/common/UpdateContext';

export class ExplorationScene extends Scene {
  private game: Game;
  private player: PlayerEntity;
  private tileSize: number;
  private mapWidth: number;
  private mapHeight: number;

  // Simple tilemap data (0 = grass, 1 = water, 2 = path, 3 = tree)
  private tilemap: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 0, 0, 0, 1],
    [1, 0, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 0, 0, 0, 1],
    [1, 0, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  constructor(game: Game) {
    super();
    this.game = game;
    this.tileSize = game.getConfig().tileSize;
    this.mapWidth = 25;
    this.mapHeight = 19;

    // Initialize player at starting position
    this.player = new PlayerEntity({ x: 12, y: 9 }, this.tileSize);
  }

  async init(): Promise<void> {
    // Load any resources needed for exploration scene
    console.log('Initializing exploration scene...');
  }

  update(context: UpdateContext): void {
    if (!this.isActive) return;

    const inputManager = this.game.getInputManager();

    // Update player
    this.player.update(context.deltaTime, inputManager);

    // Check for scene transitions
    if (inputManager.isJustPressed('Space')) {
      // Trigger random battle encounter
      if (Math.random() < 0.1) { // 10% chance
        this.game.getSceneManager().switchToScene('battle');
      }
    }
  }

  render(context: RenderContext): void {
    if (!this.isActive) return;

    const { ctx } = context;

    // Render tilemap
    this.renderTilemap(ctx);

    // Render player
    this.player.render(ctx);

    // Render UI
    this.renderUI(ctx);
  }

  cleanup(): void {
    console.log('Cleaning up exploration scene...');
  }

  private renderTilemap(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const tileType = this.tilemap[y][x];
        const pixelX = x * this.tileSize;
        const pixelY = y * this.tileSize;

        // Draw tile based on type
        switch (tileType) {
          case 0: // Grass
            ctx.fillStyle = '#4CAF50';
            break;
          case 1: // Water
            ctx.fillStyle = '#2196F3';
            break;
          case 2: // Path
            ctx.fillStyle = '#8D6E63';
            break;
          case 3: // Tree
            ctx.fillStyle = '#2E7D32';
            break;
          default:
            ctx.fillStyle = '#9E9E9E';
        }

        ctx.fillRect(pixelX, pixelY, this.tileSize, this.tileSize);

        // Add some visual variation for grass tiles
        if (tileType === 0 && (x + y) % 3 === 0) {
          ctx.fillStyle = '#66BB6A';
          ctx.fillRect(pixelX + 2, pixelY + 2, this.tileSize - 4, this.tileSize - 4);
        }
      }
    }
  }

  private renderUI(ctx: CanvasRenderingContext2D): void {
    // Draw position info (debug)
    if (this.game.getConfig().debugMode) {
      const pos = this.player.getPosition();
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.fillText(`Position: (${pos.x}, ${pos.y})`, 10, 580);
      ctx.fillText(`Direction: ${this.player.getDirection()}`, 10, 595);
      ctx.fillText(`Press SPACE for random battle`, 10, 25);
    }
  }
}