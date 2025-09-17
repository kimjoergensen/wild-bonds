import { GAME_CONFIG } from '@wild-bonds/configs/Constants';
import { Container, Graphics, Text } from 'pixi.js';

export interface CreatureInfo {
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
  currentExp?: number;
  maxExp?: number;
  gender?: 'M' | 'F';
}

export interface HudConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  isPlayer: boolean; // Player HUDs show EXP bar, enemy HUDs don't
}

export class BattleHud extends Container {
  private nameText!: Text;
  private levelText!: Text;
  private hpBarBg!: Graphics;
  private hpBar!: Graphics;
  private hpText?: Text;
  private expBarBg?: Graphics;
  private expBar?: Graphics;
  private expLabel?: Text;
  private currentCreature: CreatureInfo;
  private config: HudConfig;

  constructor(creature: CreatureInfo, config: HudConfig) {
    super();

    this.currentCreature = creature;
    this.config = config;

    this.x = config.x;
    this.y = config.y;

    this.createHudElements();
    this.updateDisplay();
  }

  private createHudElements(): void {
    const { width, height, isPlayer } = this.config;

    // Safer font size calculation with debugging
    const baseFontSize = Math.min(GAME_CONFIG.width, GAME_CONFIG.height) * 0.035;
    const scaledFontSize = baseFontSize / GAME_CONFIG.scale;
    const fontSize = Math.max(14, Math.min(scaledFontSize, 48)); // Clamp between 14 and 48
    const smallFontSize = Math.max(12, fontSize * 0.9);

    console.log('HUD font calculation:', { baseFontSize, scaledFontSize, fontSize, smallFontSize, scale: GAME_CONFIG.scale });

    // Background box
    const bgBox = new Graphics();
    bgBox.beginFill(0x2C2C54);
    bgBox.lineStyle(2, 0x000000);
    bgBox.drawRoundedRect(0, 0, width, height, 8);
    bgBox.endFill();
    this.addChild(bgBox);

    // Name text
    this.nameText = new Text('', {
      fontSize: fontSize,
      fill: 0xFFFFFF,
      fontWeight: 'bold'
    });
    this.nameText.x = width * 0.08;
    this.nameText.y = height * 0.15;
    this.addChild(this.nameText);

    // Level text
    this.levelText = new Text('', {
      fontSize: smallFontSize,
      fill: isPlayer ? 0xFF4444 : 0xFFFFFF
    });
    this.levelText.x = width * 0.75;
    this.levelText.y = height * 0.18;
    this.addChild(this.levelText);

    // HP bar background
    this.hpBarBg = new Graphics();
    this.hpBarBg.beginFill(0x000000);
    this.hpBarBg.drawRoundedRect(width * 0.18, height * 0.5, width * 0.6, height * 0.15, 6);
    this.hpBarBg.endFill();
    this.addChild(this.hpBarBg);

    // HP bar
    this.hpBar = new Graphics();
    this.addChild(this.hpBar);

    // HP label
    const hpLabel = new Text('HP', {
      fontSize: smallFontSize * 0.7,
      fill: 0xFFD700,
      fontWeight: 'bold'
    });
    hpLabel.x = width * 0.05;
    hpLabel.y = height * 0.48;
    this.addChild(hpLabel);

    // Player-specific elements (HP text and EXP bar)
    if (isPlayer) {
      this.hpText = new Text('', {
        fontSize: smallFontSize * 0.8,
        fill: 0xFFFFFF
      });
      this.hpText.x = width * 0.85;
      this.hpText.y = height * 0.52;
      this.addChild(this.hpText);

      // EXP bar background
      this.expBarBg = new Graphics();
      this.expBarBg.beginFill(0x000000);
      this.expBarBg.drawRoundedRect(width * 0.18, height * 0.78, width * 0.6, height * 0.08, 4);
      this.expBarBg.endFill();
      this.addChild(this.expBarBg);

      // EXP bar
      this.expBar = new Graphics();
      this.addChild(this.expBar);

      // EXP label
      this.expLabel = new Text('EXP', {
        fontSize: smallFontSize * 0.6,
        fill: 0xFFD700,
        fontWeight: 'bold'
      });
      this.expLabel.x = width * 0.05;
      this.expLabel.y = height * 0.78;
      this.addChild(this.expLabel);
    }
  }

  private updateDisplay(): void {
    const { name, level, currentHp, maxHp, currentExp, maxExp, gender } = this.currentCreature;
    const { width, height, isPlayer } = this.config;

    // Update name with gender symbol
    const genderSymbol = gender === 'M' ? '♂' : gender === 'F' ? '♀' : '';
    this.nameText.text = `${name}${genderSymbol}`;

    // Update level
    this.levelText.text = `Lv.${level}`;

    // Calculate HP percentage
    const hpPercentage = Math.max(0, currentHp / maxHp);

    // Update HP bar
    this.hpBar.clear();
    let hpColor = 0x00FF00; // Green
    if (hpPercentage < 0.5) hpColor = 0xFFFF00; // Yellow
    if (hpPercentage < 0.2) hpColor = 0xFF0000; // Red

    this.hpBar.beginFill(hpColor);
    this.hpBar.drawRoundedRect(
      width * 0.185,
      height * 0.515,
      width * 0.59 * hpPercentage,
      height * 0.12,
      4
    );
    this.hpBar.endFill();

    // Update HP text for player
    if (isPlayer && this.hpText) {
      this.hpText.text = `${currentHp}/${maxHp}`;
    }

    // Update EXP bar for player
    if (isPlayer && this.expBar && currentExp !== undefined && maxExp !== undefined) {
      const expPercentage = Math.max(0, currentExp / maxExp);

      this.expBar.clear();
      this.expBar.beginFill(0x0080FF); // Blue
      this.expBar.drawRoundedRect(
        width * 0.185,
        height * 0.785,
        width * 0.59 * expPercentage,
        height * 0.065,
        2
      );
      this.expBar.endFill();
    }
  }

  public updateCreature(creature: CreatureInfo): void {
    this.currentCreature = creature;
    this.updateDisplay();
  }

  public animateHpChange(newHp: number, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const startHp = this.currentCreature.currentHp;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentHp = Math.round(startHp + (newHp - startHp) * easedProgress);

        this.currentCreature.currentHp = currentHp;
        this.updateDisplay();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }
}