import { SceneManager } from '@wild-bonds/core/SceneManager';
import { PlayerEntity } from '@wild-bonds/entities/PlayerEntity';
import { ExplorationScene } from '@wild-bonds/scenes/ExplorationScene';
import { InputManager } from '@wild-bonds/systems/InputManager';
import { GameConfig } from '@wild-bonds/types/common/GameConfig';
import { Vector2 } from '@wild-bonds/types/common/Vector2';
import { Application, Assets, Sprite } from 'pixi.js';


export class Game {
  public readonly app: Application;
  public readonly config: GameConfig;
  public readonly player: PlayerEntity;
  public readonly sceneManager: SceneManager;
  public readonly inputManager: InputManager;

  private lastTime: number = 0;
  private isRunning: boolean = false;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;

  constructor(config: GameConfig, app: Application) {
    this.app = app;
    this.config = config;

    const stage = this.app.stage;
    stage.width = screen.width;
    stage.height = screen.height;
    stage.scale.set(4);

    this.sceneManager = new SceneManager(stage);
    this.inputManager = new InputManager();

    const playerStart: Vector2 = { x: 4, y: 4 };
    this.player = new PlayerEntity(playerStart, this.config.tileSize);
  }

  /**
   * Starts the game loop if not already running.
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Game is already running.');
      return;
    }

    // Pass only tileSize to ExplorationScene
    const explorationScene = new ExplorationScene(this.config.tileSize);
    this.sceneManager.registerScene('exploration', explorationScene);
    const sceneContainer = await this.sceneManager.switchToScene('exploration');

    // Load player sprite
    const playerTexture = await Assets.load('/tilesets/Player/Player.png');
    const sprite = new Sprite(playerTexture);
    this.player.sprite = sprite;
    sceneContainer.addChild(sprite);

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

    // Player movement and update
    this.player.update(deltaTime, this.inputManager);
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