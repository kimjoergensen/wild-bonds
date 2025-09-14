import * as PIXI from 'pixi.js';

export class GraphicsManager {
  private app: PIXI.Application;

  constructor(width: number, height: number) {
    this.app = new PIXI.Application({ width, height });
    document.body.appendChild(this.app.view);
  }

  // Add a method to render something
  render() {
    // Example rendering code
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xff0000);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();
    this.app.stage.addChild(graphics);
  }

  // Additional methods for rendering can be added here
}