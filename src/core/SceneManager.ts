import { Scene } from '@wild-bonds/core/Scene';
import { RenderContext } from '@wild-bonds/types/common/RenderContext';
import { SceneType } from '@wild-bonds/types/common/SceneType';
import { UpdateContext } from '@wild-bonds/types/common/UpdateContext';

export class SceneManager {
  private scenes: Map<SceneType, Scene> = new Map();
  private currentScene: Scene | null = null;
  private currentSceneType: SceneType | null = null;

  public registerScene(type: SceneType, scene: Scene): void {
    this.scenes.set(type, scene);
  }

  public async switchToScene(type: SceneType): Promise<void> {
    const newScene = this.scenes.get(type);

    if (!newScene) {
      throw new Error(`Scene "${type}" not found`);
    }

    // Cleanup current scene
    if (this.currentScene) {
      this.currentScene.deactivate();
      this.currentScene.cleanup();
    }

    // Initialize and activate new scene
    this.currentScene = newScene;
    this.currentSceneType = type;

    await this.currentScene.init();
    this.currentScene.activate();

    // Update debug info
    this.updateDebugInfo(type);
  }

  public getCurrentSceneType(): SceneType | null {
    return this.currentSceneType;
  }

  public update(context: UpdateContext): void {
    if (this.currentScene && this.currentScene.getIsActive()) {
      this.currentScene.update(context);
    }
  }

  public render(context: RenderContext): void {
    if (this.currentScene && this.currentScene.getIsActive()) {
      this.currentScene.render(context);
    }
  }

  private updateDebugInfo(sceneType: SceneType): void {
    const sceneElement = document.getElementById('current-scene');
    if (sceneElement) {
      sceneElement.textContent = sceneType;
    }
  }
}