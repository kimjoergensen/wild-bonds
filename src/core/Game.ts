import { SceneManager } from '@wild-bonds/core/SceneManager';
import { ExplorationScene } from '@wild-bonds/scenes/ExplorationScene';
import { InputManager } from '@wild-bonds/systems/InputManager';
import { GameConfig } from '@wild-bonds/types/common/GameConfig';
import { Application } from 'pixi.js';


export class Game {
  public readonly config: GameConfig;
  public readonly sceneManager: SceneManager;
  public readonly inputManager: InputManager;
  public readonly app: Application;

  private lastTime: number = 0;
  private isRunning: boolean = false;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;

  constructor(config: GameConfig, app: Application) {
    this.config = config;
    this.app = app;
    const stage = this.app.stage;
    stage.width = screen.width;
    stage.height = screen.height;
    stage.scale.set(4);
    this.sceneManager = new SceneManager(stage);
    this.inputManager = new InputManager();
  }

  /**
   * Starts the game loop if not already running.
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Game is already running.');
      return;
    }

    const explorationScene = new ExplorationScene();
    this.sceneManager.registerScene('exploration', explorationScene);
    await this.sceneManager.switchToScene('exploration');

    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  /**
   * Stops the game loop.
   */
  public stop(): void {
    this.isRunning = false;
  }

  private gameLoop = (currentTime: number): void => {
    if (!this.isRunning) {
      return;
    }

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1 / 24); // Cap at 24fps minimum
    this.lastTime = currentTime;

    // Update
    // const updateContext: UpdateContext = {
    //   deltaTime,
    //   currentTime
    // };

    this.inputManager.update();
    // this.sceneManager.update(updateContext);

    // Update FPS counter
    this.updateFPS(deltaTime);

    // Continue loop
    requestAnimationFrame(this.gameLoop);
  };

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