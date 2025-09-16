import { Scene } from '@wild-bonds/core/Scene';
import { Container, Graphics, Text } from 'pixi.js';

export class BattleScene extends Scene {
  public async init(container: Container): Promise<void> {
    // Main battle box
    const mainBox = new Graphics();
    mainBox.lineStyle(2, 0xffffff, 1);
    mainBox.beginFill(0x22223a, 0.98);
    mainBox.drawRoundedRect(20, 20, 600, 340, 12);
    mainBox.endFill();
    container.addChild(mainBox);

    // Enemy HP bar background
    const enemyHpBg = new Graphics();
    enemyHpBg.beginFill(0x444444);
    enemyHpBg.drawRect(40, 40, 220, 18);
    enemyHpBg.endFill();
    container.addChild(enemyHpBg);
    // Enemy HP bar (80/100)
    const enemyHp = new Graphics();
    enemyHp.beginFill(0x6ee06e);
    enemyHp.drawRect(40, 40, 176, 18); // 80/100 = 176px
    enemyHp.endFill();
    container.addChild(enemyHp);
    // Enemy HP text
    const enemyHpText = new Text('Enemy Creature HP: ████████░░ 80/100', { fontSize: 16, fill: 0xffffff });
    enemyHpText.x = 40;
    enemyHpText.y = 18;
    container.addChild(enemyHpText);

    // Enemy sprite placeholder
    const enemySprite = new Graphics();
    enemySprite.beginFill(0xaaaaee);
    enemySprite.drawEllipse(120, 90, 48, 32);
    enemySprite.endFill();
    container.addChild(enemySprite);

    // Player sprite placeholder
    const playerSprite = new Graphics();
    playerSprite.beginFill(0xeec16e);
    playerSprite.drawEllipse(480, 220, 48, 32);
    playerSprite.endFill();
    container.addChild(playerSprite);

    // Player HP bar background
    const playerHpBg = new Graphics();
    playerHpBg.beginFill(0x444444);
    playerHpBg.drawRect(340, 260, 220, 18);
    playerHpBg.endFill();
    container.addChild(playerHpBg);
    // Player HP bar (60/100)
    const playerHp = new Graphics();
    playerHp.beginFill(0x6ee06e);
    playerHp.drawRect(340, 260, 132, 18); // 60/100 = 132px
    playerHp.endFill();
    container.addChild(playerHp);
    // Player HP text
    const playerHpText = new Text('Player Creature HP: ██████░░░░ 60/100', { fontSize: 16, fill: 0xffffff });
    playerHpText.x = 340;
    playerHpText.y = 238;
    container.addChild(playerHpText);

    // Command box
    const cmdBox = new Graphics();
    cmdBox.lineStyle(2, 0xffffff, 1);
    cmdBox.beginFill(0x181820, 0.98);
    cmdBox.drawRoundedRect(40, 300, 540, 50, 8);
    cmdBox.endFill();
    container.addChild(cmdBox);

    // Command text
    const cmdText = new Text('What will Sparky do?', { fontSize: 16, fill: 0xffffff });
    cmdText.x = 56;
    cmdText.y = 308;
    container.addChild(cmdText);

    // Command options
    const optionsText = new Text('> Fight    Bag\n  Creature Run', { fontSize: 16, fill: 0xffffff });
    optionsText.x = 56;
    optionsText.y = 330;
    container.addChild(optionsText);
  }

  cleanup(): void {
    // Cleanup logic for battle scene
  }
}
