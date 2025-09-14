import { RenderContext } from '@wild-bonds/types/common/RenderContext';
import { UpdateContext } from '@wild-bonds/types/common/UpdateContext';

export abstract class Scene {
  protected isActive: boolean = false;

  abstract init(): Promise<void>;
  abstract update(context: UpdateContext): void;
  abstract render(context: RenderContext): void;
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