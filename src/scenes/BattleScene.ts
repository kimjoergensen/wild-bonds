import { GAME_CONFIG } from '@wild-bonds/configs/Constants';
import { Scene } from '@wild-bonds/core/Scene';
import { CreatureSprite } from '@wild-bonds/graphics/CreatureSprite';
import { Creature } from '@wild-bonds/types/game/Creature';
import { Container, Graphics } from 'pixi.js';


type ExitCallback = () => void;

export class BattleScene extends Scene {
  private onExit: ExitCallback | null = null;
  private playerCreature: Creature;
  private enemyCreature: Creature;
  private playerSprite: CreatureSprite | null = null;
  private enemySprite: CreatureSprite | null = null;

  constructor(assetsLoader: any, playerCreature: Creature, enemyCreature: Creature) {
    super(assetsLoader);
    this.playerCreature = playerCreature;
    this.enemyCreature = enemyCreature;
  }

  /**
   * Set a callback to be called when the player wants to exit the battle.
   * @param cb Callback function
   */
  public setExitCallback(cb: ExitCallback) {
    this.onExit = cb;
  }

  public async init(container: Container): Promise<void> {
    // Get effective dimensions accounting for stage scale
    const width = GAME_CONFIG.width / GAME_CONFIG.scale;
    const height = GAME_CONFIG.height / GAME_CONFIG.scale;

    // Simple water-themed gradient background
    const background = new Graphics();
    // background.fill(0x4A90E2); // Light blue top
    background.rect(0, 0, width, height * 0.5).fill(0x4A90E2);
    // background.endFill();
    // background.fill(0x2E5984); // Darker blue bottom
    background.rect(0, height * 0.5, width, height * 0.5).fill(0x2E5984);
    container.addChild(background);

    // Battle platforms
    const enemyPlatform = new Graphics();
    // enemyPlatform.beginFill(0x2E5984, 0.7);
    enemyPlatform.ellipse(width * 0.75, height * 0.56, width * 0.1, height * 0.06).fill(0x2E5984);
    // enemyPlatform.endFill();
    container.addChild(enemyPlatform);

    const playerPlatform = new Graphics();
    // playerPlatform.beginFill(0x1E3A5F, 0.7);
    playerPlatform.ellipse(width * 0.25, height * 0.81, width * 0.12, height * 0.07).fill(0x1E3A5F);
    // playerPlatform.endFill();
    container.addChild(playerPlatform);

    // --- Creature Sprites ---
    // Import AssetsLoader dynamically to avoid circular deps if needed
    // Use the '_0' frame from the spritesheet for both creatures
    const enemySheet = this.assetsLoader.getSpritesheet(this.enemyCreature.name.toLowerCase() as any);
    const enemyFrame = enemySheet.textures[`${this.enemyCreature.name.toLowerCase()}_0`];
    const { Sprite } = await import('pixi.js');
    const enemySprite = new Sprite(enemyFrame);
    enemySprite.x = width * 0.75;
    enemySprite.y = height * 0.56;
    enemySprite.anchor.set(0.5, 0.8);
    enemySprite.scale.set(2);
    container.addChild(enemySprite);

    const playerSheet = this.assetsLoader.getSpritesheet(this.playerCreature.name.toLowerCase() as any);
    const playerFrame = playerSheet.textures[`${this.playerCreature.name.toLowerCase()}_0`];
    const playerSprite = new Sprite(playerFrame);
    playerSprite.x = width * 0.25;
    playerSprite.y = height * 0.81;
    playerSprite.anchor.set(0.5, 0.8);
    playerSprite.scale.set(2);
    container.addChild(playerSprite);

    // Command interface box
    const commandBox = new Graphics();
    // commandBox.beginFill(0x2C2C54);
    commandBox.setStrokeStyle({ width: 2, color: 0x000000 }).rect(0, height * 0.85, width, height * 0.15).fill(0x2C2C54);
    // commandBox.drawRect(0, height * 0.85, width, height * 0.15);
    // commandBox.endFill();
    container.addChild(commandBox);

    // Text indicator using graphics (no Text constructor needed)
    const textIndicator = new Graphics();
    // textIndicator.beginFill(0xFFFF00); // Yellow indicator
    textIndicator.rect(width * 0.05, height * 0.88, width * 0.3, height * 0.03).fill(0xFFFF00);
    // textIndicator.endFill();
    container.addChild(textIndicator);

    console.log('Battle scene initialized successfully');
  }

  public activate(): void {
    // Add keydown listener for escape
    document.addEventListener('keydown', this.handleKeyDown);
  }

  public deactivate(): void {
    // Remove keydown listener
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.onExit) {
      console.log('Escaping from battle...');
      this.onExit();
    }
  };

  public cleanup(): void {
    // Cleanup logic for battle scene
  }
}