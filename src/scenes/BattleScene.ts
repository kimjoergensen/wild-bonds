import { Game } from '@wild-bonds/core/Game';
import { Scene } from '@wild-bonds/core/Scene';
import { CreatureEntity } from '@wild-bonds/entities/CreatureEntity';
import { RenderContext } from '@wild-bonds/types/common/RenderContext';
import { UpdateContext } from '@wild-bonds/types/common/UpdateContext';
import { BattleState } from '@wild-bonds/types/game/BattleState';
import { CREATURES } from '@wild-bonds/utils/CreatureData';

export class BattleScene extends Scene {
  private game: Game;
  private battleState: BattleState;
  private selectedAction: number;
  private playerCreature: CreatureEntity | null;
  private enemyCreature: CreatureEntity | null;
  private animationTimer: number;
  private messageText: string;
  private messageTimer: number;

  private readonly actions = ['Fight', 'Catch', 'Run'];

  constructor(game: Game) {
    super();
    this.game = game;
    this.battleState = 'selecting-action';
    this.selectedAction = 0;
    this.playerCreature = null;
    this.enemyCreature = null;
    this.animationTimer = 0;
    this.messageText = '';
    this.messageTimer = 0;
  }

  async init(): Promise<void> {
    console.log('Initializing battle scene...');

    // Create mock creatures for demonstration
    this.playerCreature = new CreatureEntity(CREATURES.flamepup, 100);

    this.enemyCreature = new CreatureEntity(CREATURES.grassling, 80);

    this.setMessage('A wild Grassling appeared!');
  }

  update(context: UpdateContext): void {
    if (!this.isActive) return;

    const inputManager = this.game.getInputManager();
    this.messageTimer += context.deltaTime;

    switch (this.battleState) {
      case 'selecting-action':
        this.updateActionSelection(inputManager);
        break;
      case 'animating':
        this.updateAnimation(context.deltaTime);
        break;
      case 'enemy-turn':
        this.updateEnemyTurn(context.deltaTime);
        break;
      case 'victory':
      case 'defeat':
        if (inputManager.isConfirmPressed()) {
          this.game.getSceneManager().switchToScene('exploration');
        }
        break;
    }
  }

  render(context: RenderContext): void {
    if (!this.isActive) return;

    const { ctx } = context;

    // Clear with battle background
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(0, 0, 800, 600);

    // Draw battle arena
    this.renderArena(ctx);

    // Draw creatures
    this.renderCreatures(ctx);

    // Draw UI
    this.renderUI(ctx);
  }

  cleanup(): void {
    console.log('Cleaning up battle scene...');
  }

  private updateActionSelection(inputManager: any): void {
    if (inputManager.isJustPressed('ArrowUp')) {
      this.selectedAction = Math.max(0, this.selectedAction - 1);
    } else if (inputManager.isJustPressed('ArrowDown')) {
      this.selectedAction = Math.min(this.actions.length - 1, this.selectedAction + 1);
    }

    if (inputManager.isConfirmPressed()) {
      this.executeAction(this.selectedAction);
    }

    if (inputManager.isCancelPressed()) {
      this.game.getSceneManager().switchToScene('exploration');
    }
  }

  private updateAnimation(deltaTime: number): void {
    this.animationTimer += deltaTime;

    if (this.animationTimer >= 2.0) {
      this.animationTimer = 0;

      if (this.enemyCreature && this.enemyCreature.health > 0) {
        this.battleState = 'enemy-turn';
      } else {
        this.battleState = 'victory';
        this.setMessage('Victory! You defeated the wild creature!');
      }
    }
  }

  private updateEnemyTurn(deltaTime: number): void {
    this.animationTimer += deltaTime;

    if (this.animationTimer >= 1.5) {
      // Enemy attacks
      if (this.playerCreature && this.enemyCreature) {
        const damage = Math.max(1, this.enemyCreature.stats.attack - this.playerCreature.stats.defense + Math.floor(Math.random() * 5));
        const actualDamage = this.playerCreature.takeDamage(damage);

        this.setMessage(`Wild Grassling used Tackle! ${this.playerCreature.name} took ${actualDamage} damage!`);

        if (this.playerCreature.isDead) {
          this.battleState = 'defeat';
          this.setMessage('Your creature fainted! You lost the battle.');
        } else {
          this.battleState = 'selecting-action';
        }
      }

      this.animationTimer = 0;
    }
  }

  private executeAction(actionIndex: number): void {
    const action = this.actions[actionIndex];

    switch (action) {
      case 'Fight':
        this.executeFight();
        break;
      case 'Catch':
        this.executeCatch();
        break;
      case 'Run':
        this.executeRun();
        break;
    }
  }

  private executeFight(): void {
    if (!this.playerCreature || !this.enemyCreature) return;

    const damage = Math.max(1, this.playerCreature.stats.attack - this.enemyCreature.stats.defense + Math.floor(Math.random() * 5));
    const actualDamage = this.enemyCreature.takeDamage(damage);

    this.setMessage(`${this.playerCreature.name} used Tackle! Wild Grassling took ${actualDamage} damage!`);
    this.battleState = 'animating';
    this.animationTimer = 0;
  }

  private executeCatch(): void {
    if (!this.enemyCreature) return;

    const catchRate = 0.3; // 30% base catch rate
    const healthFactor = 1 - (this.enemyCreature.health / this.enemyCreature.stats.maxHealth);
    const finalCatchRate = Math.min(0.9, catchRate + healthFactor * 0.4);

    if (Math.random() < finalCatchRate) {
      this.setMessage('Success! You caught the wild Grassling!');
      this.battleState = 'victory';
    } else {
      this.setMessage('The creature broke free!');
      this.battleState = 'enemy-turn';
      this.animationTimer = 0;
    }
  }

  private executeRun(): void {
    this.setMessage('You ran away safely!');
    setTimeout(() => {
      this.game.getSceneManager().switchToScene('exploration');
    }, 1000);
  }

  private renderArena(ctx: CanvasRenderingContext2D): void {
    // Draw ground
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 400, 800, 200);

    // Draw sky
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#e0f6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);
  }

  private renderCreatures(ctx: CanvasRenderingContext2D): void {
    // Draw player creature (back view)
    if (this.playerCreature) {
      ctx.fillStyle = '#f44336';
      ctx.fillRect(150, 350, 80, 80);

      // Health bar
      this.renderHealthBar(ctx, 50, 450, this.playerCreature);
    }

    // Draw enemy creature (front view)
    if (this.enemyCreature) {
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(550, 250, 80, 80);

      // Health bar
      this.renderHealthBar(ctx, 500, 200, this.enemyCreature);
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, creature: CreatureEntity): void {
    const barWidth = 120;
    const barHeight = 12;
    const healthPercent = creature.health / creature.stats.maxHealth;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health bar
    ctx.fillStyle = healthPercent > 0.5 ? '#4caf50' : healthPercent > 0.2 ? '#ff9800' : '#f44336';
    ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Text
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    const name = creature.nickname || 'Wild Creature';
    ctx.fillText(name, x, y - 5);
    ctx.fillText(`${creature.health}/${creature.stats.maxHealth}`, x, y + 25);
  }

  private renderUI(ctx: CanvasRenderingContext2D): void {
    // Message box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(50, 480, 700, 100);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 480, 700, 100);

    // Message text
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    this.wrapText(ctx, this.messageText, 70, 510, 660, 20);

    // Action menu (only show when selecting action)
    if (this.battleState === 'selecting-action') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(600, 350, 180, 120);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(600, 350, 180, 120);

      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';

      this.actions.forEach((action, index) => {
        const y = 375 + index * 25;
        if (index === this.selectedAction) {
          ctx.fillStyle = '#2196f3';
          ctx.fillRect(610, y - 15, 160, 20);
          ctx.fillStyle = '#fff';
        }
        ctx.fillText(action, 620, y);
      });
    }
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  private setMessage(message: string): void {
    this.messageText = message;
    this.messageTimer = 0;
  }
}