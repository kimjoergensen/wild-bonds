import { Container } from 'pixi.js';

export abstract class Scene {
  protected isActive: boolean = false;

  abstract init(container: Container): Promise<void>;
  abstract cleanup(): void;

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}