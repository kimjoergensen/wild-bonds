import { AssetsLoader } from '@wild-bonds/graphics/AssetsLoader';
import { Container } from 'pixi.js';

export abstract class Scene {
  protected readonly assetsLoader: AssetsLoader;
  protected isActive: boolean = false;

  constructor(assetsLoader: AssetsLoader) {
    this.assetsLoader = assetsLoader;
  }

  /**
   * Initialize the scene.
   * @param container The container to initialize the scene in.
   */
  public abstract init(container: Container): Promise<void>;

  /**
   * Clean up the scene (called when the scene is deactivated or switched out).
   */
  public abstract cleanup(): void;

  /**
   * Activate the scene (called when the scene becomes active).
   */
  public activate(): void {
    this.isActive = true;
  }

  /**
   * Deactivate the scene (called when the scene is no longer active).
   */
  public deactivate(): void {
    this.isActive = false;
  }

  /**
   * Get the active state of the scene.
   * @returns Whether the scene is currently active.
   */
  public getIsActive(): boolean {
    return this.isActive;
  }
}