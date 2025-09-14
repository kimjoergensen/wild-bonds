import { Scene } from '@wild-bonds/core/Scene';
import { SceneType } from '@wild-bonds/types/common/SceneType';
import { Container } from 'pixi.js';

export class SceneManager {
  private stage: Container;
  private scenes: Map<SceneType, Scene> = new Map();
  private currentScene: Scene | null = null;
  private currentSceneType: SceneType | null = null;

  constructor(container: Container) {
    this.stage = container;
  }

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

    const container = await this.currentScene.init();
    this.currentScene.activate();
    this.stage.removeChildren();
    this.stage.addChild(container);

    // // Update debug info
    this.updateDebugInfo(type);
  }

  public getCurrentSceneType(): SceneType | null {
    return this.currentSceneType;
  }

  private updateDebugInfo(sceneType: SceneType): void {
    const sceneElement = document.getElementById('current-scene');
    if (sceneElement) {
      sceneElement.textContent = sceneType;
    }
  }
}