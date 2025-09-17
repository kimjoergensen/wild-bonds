import { GAME_CONFIG } from '@wild-bonds/configs/Constants';
import { Scene } from '@wild-bonds/core/Scene';
import { Container, Graphics } from 'pixi.js';

type ExitCallback = () => void;

export class BattleScene extends Scene {
  private onExit: ExitCallback | null = null;

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

    // Enemy placeholder (simple rectangle)
    const enemyPlaceholder = new Graphics();
    // enemyPlaceholder.beginFill(0xFF6B35); // Orange
    enemyPlaceholder.rect(width * 0.7, height * 0.45, width * 0.1, height * 0.15).fill(0xFF6B35);
    // enemyPlaceholder.endFill();
    container.addChild(enemyPlaceholder);

    // Player placeholder (simple rectangle)
    const playerPlaceholder = new Graphics();
    // playerPlaceholder.beginFill(0x87CEEB); // Light blue
    playerPlaceholder.rect(width * 0.2, height * 0.7, width * 0.1, height * 0.15).fill(0x87CEEB);
    // playerPlaceholder.endFill();
    container.addChild(playerPlaceholder);

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