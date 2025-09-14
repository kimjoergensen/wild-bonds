import { SceneManager } from '@wild-bonds/core/SceneManager';
import { InputManager } from '@wild-bonds/systems/InputManager';
import { GameConfig } from '@wild-bonds/types/common/GameConfig';
import { RenderContext } from '@wild-bonds/types/common/RenderContext';
import { UpdateContext } from '@wild-bonds/types/common/UpdateContext';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private sceneManager: SceneManager;
  private inputManager: InputManager;

  private lastTime: number = 0;
  private isRunning: boolean = false;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;

  constructor(config: GameConfig) {
    this.config = config;

    // Get canvas element
    const canvas = document.getElementById(config.canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${config.canvasId}" not found`);
    }

    this.canvas = canvas;
    this.canvas.width = config.width;
    this.canvas.height = config.height;

    // Get rendering context
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.ctx = ctx;

    // Initialize systems
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager();

    // Configure rendering context for pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  public getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  public getInputManager(): InputManager {
    return this.inputManager;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getConfig(): GameConfig {
    return this.config;
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  public stop(): void {
    this.isRunning = false;
  }

  private gameLoop = (currentTime: number): void => {
    if (!this.isRunning) {
      return;
    }

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1 / 30); // Cap at 30fps minimum
    this.lastTime = currentTime;

    // Update
    const updateContext: UpdateContext = {
      deltaTime,
      currentTime
    };

    this.inputManager.update();
    this.sceneManager.update(updateContext);

    // Render
    this.clearCanvas();

    const renderContext: RenderContext = {
      ctx: this.ctx,
      deltaTime,
      currentTime
    };

    this.sceneManager.render(renderContext);

    // Update FPS counter
    this.updateFPS(deltaTime);

    // Continue loop
    requestAnimationFrame(this.gameLoop);
  };

  private clearCanvas(): void {
    this.ctx.fillStyle = '#0f3460';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updateFPS(deltaTime: number): void {
    if (!this.config.debugMode) return;

    this.frameCount++;
    this.fpsUpdateTime += deltaTime;

    if (this.fpsUpdateTime >= 1.0) {
      const fps = Math.round(this.frameCount / this.fpsUpdateTime);
      const fpsElement = document.getElementById('fps');
      if (fpsElement) {
        fpsElement.textContent = fps.toString();
      }

      this.frameCount = 0;
      this.fpsUpdateTime = 0;
    }
  }
}