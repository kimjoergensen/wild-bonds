import { AssetsLoader } from '@wild-bonds/graphics/AssetsLoader';
import { Container } from 'pixi.js';

export abstract class Scene {
  protected readonly assetsLoader: AssetsLoader;
  protected isActive: boolean = false;

  constructor(assetsLoader: AssetsLoader) {
    this.assetsLoader = assetsLoader;
  }

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