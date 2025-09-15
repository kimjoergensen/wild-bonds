import { GAME_CONFIG } from '@wild-bonds/configs/Constants';
import { SceneManager } from '@wild-bonds/core/SceneManager';
import { PlayerEntity } from '@wild-bonds/entities/PlayerEntity';
import { AssetsLoader } from '@wild-bonds/graphics/AssetsLoader';
import { ExplorationScene } from '@wild-bonds/scenes/ExplorationScene';
import { InputManager } from '@wild-bonds/systems/InputManager';
import { Vector2 } from '@wild-bonds/types/common/Vector2';
import { AnimatedSprite, Application, Assets, Spritesheet } from 'pixi.js';


export class Game {
  private readonly app: Application;
  private readonly assetsLoader: AssetsLoader;
  private readonly player: PlayerEntity;
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

    // Pass only tileSize to ExplorationScene
    const explorationScene = new ExplorationScene(this.assetsLoader);
    this.sceneManager.registerScene('exploration', explorationScene);
    const sceneContainer = await this.sceneManager.switchToScene('exploration');

    // Load player sprite
    const playerTexture = await Assets.load('sprites/player/Player.png');
    const playerSpritesheet: Spritesheet = await Assets.load('sprites/player/Player.json');

    Assets.add({
      alias: 'player',
      src: 'sprites/player/Player.json',
      data: { texture: playerTexture }
    });

    const frames = playerSpritesheet.data.animations?.['run_side'];
    const textureArray = [];
    for (const frame of frames || []) {
      const texture = playerSpritesheet.textures[frame];
      if (texture) {
        textureArray.push(texture);
      } else {
        throw new Error(`Texture not found for frame: ${frame}`);
      }
    }

    const anim = new AnimatedSprite(textureArray);
    anim.width = GAME_CONFIG.tileSize * 2;
    anim.height = GAME_CONFIG.tileSize * 2;
    // anim.x = (1 * GAME_CONFIG.tileSize) / 2;
    anim.x = 48 - 8;
    anim.y = 16 - 12;
    // anim.y = (6 * GAME_CONFIG.tileSize) + (GAME_CONFIG.tileSize / 2);
    anim.animationSpeed = 0.12;
    anim.play();
    // this.player.setAnimation(anim);
    sceneContainer.addChild(anim);
    // const player = AnimatedSprite.fromFrames();
    // console.log('anim', anim);
    // anim.animationSpeed = 0.15;
    // anim.play();
    // this.player.setAnimation(anim);
    // const sprite = new Sprite(playerTexture);
    // this.player.setSprite(sprite);
    // sceneContainer.addChild(anim);

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
    this.player.update(deltaTime, this.inputManager.isMovementPressed());
    // this.sceneManager.update(updateContext);

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