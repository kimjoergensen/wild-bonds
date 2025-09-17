import { GAME_CONFIG } from '@wild-bonds/configs/Constants';
import { PlayerEntity } from '@wild-bonds/entities/PlayerEntity';
import { AssetsLoader } from '@wild-bonds/graphics/AssetsLoader';
import { BattleScene } from '@wild-bonds/scenes/BattleScene';
import { ExplorationScene } from '@wild-bonds/scenes/ExplorationScene';
import { InputManager } from '@wild-bonds/systems/InputManager';
import { SceneManager } from '@wild-bonds/systems/SceneManager';
import { Vector2 } from '@wild-bonds/types/common/Vector2';
import { Application, Container } from 'pixi.js';


export class Game {
  private readonly app: Application;
  private readonly assetsLoader: AssetsLoader;
  private readonly player: PlayerEntity;
  private explorationScene: ExplorationScene | null = null;
  private explorationContainer: Container | null = null;
  private prevPlayerTile: { x: number; y: number; } | null = null;
  private readonly sceneManager: SceneManager;
  private readonly inputManager: InputManager;

  private lastTime: number = 0;
  private isRunning: boolean = false;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;

  constructor(app: Application, assetsLoader: AssetsLoader) {
    this.app = app;
    this.assetsLoader = assetsLoader;

    const stage = this.app.stage;
    stage.width = screen.width;
    stage.height = screen.height;
    stage.scale.set(GAME_CONFIG.scale);

    this.sceneManager = new SceneManager(stage);
    this.inputManager = new InputManager();

    const playerStart: Vector2 = { x: 5, y: 4 };
    this.player = new PlayerEntity(playerStart, GAME_CONFIG.tileSize);
  }

  /**
   * Starts the game loop if not already running.
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Game is already running.');
      return;
    }

    // Load world
    const explorationScene = new ExplorationScene(this.assetsLoader);
    this.explorationScene = explorationScene;
    // Register both scenes
    this.sceneManager.registerScene('exploration', explorationScene);
    const battleScene = new BattleScene(this.assetsLoader);
    this.sceneManager.registerScene('battle', battleScene);

    // Set up callbacks for scene transitions
    explorationScene.setEncounterCallback(() => {
      this.switchToBattleScene();
    });
    battleScene.setExitCallback(() => {
      this.switchToExplorationScene();
    });

    const sceneContainer = await this.sceneManager.switchToScene('exploration');
    this.explorationContainer = sceneContainer;

    // Load player sprite and initialize graphics
    const playerSpritesheet = this.assetsLoader.getAnimationSpritesheet('player');
    this.player.initializeGraphics(playerSpritesheet);

    const playerSprite = this.player.getSprite();
    if (playerSprite) {
      sceneContainer.addChild(playerSprite);
    }

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

  private async switchToBattleScene(): Promise<void> {
    await this.sceneManager.switchToScene('battle');
  }

  private async switchToExplorationScene(): Promise<void> {
    const sceneContainer = await this.sceneManager.switchToScene('exploration');
    this.explorationContainer = sceneContainer;

    // Re-add player sprite to exploration scene
    const playerSprite = this.player.getSprite();
    if (playerSprite) {
      sceneContainer.addChild(playerSprite);
    }
  }

  private gameLoop = (currentTime: number): void => {
    if (!this.isRunning) {
      return;
    }

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1 / 24); // Cap at 24fps minimum
    this.lastTime = currentTime;

    this.inputManager.update();

    // Only update player and check encounters when in exploration scene
    const currentSceneType = this.sceneManager.getCurrentSceneType();
    if (currentSceneType === 'exploration') {
      // Player movement and update
      this.player.update(deltaTime, this.inputManager.isMovementPressed());

      // After player movement, check for random encounter only if player moved to a new tile
      if (this.explorationScene) {
        const pos = this.player.getPosition();
        if (!this.prevPlayerTile || this.prevPlayerTile.x !== pos.x || this.prevPlayerTile.y !== pos.y) {
          this.explorationScene.checkForRandomEncounter(pos.x, pos.y);
        }
        this.prevPlayerTile = { x: pos.x, y: pos.y };
      }
    }

    // Update FPS counter
    this.updateFPS(deltaTime);

    // Continue loop
    requestAnimationFrame(this.gameLoop);
  };

  private updateFPS(deltaTime: number): void {
    if (!GAME_CONFIG.debugMode) return;

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