import { Scene } from '@wild-bonds/core/Scene';
import { Assets, Container, Sprite } from 'pixi.js';

export class ExplorationScene extends Scene {
  public async init(): Promise<Container> {
    try {
      const container = new Container();

      const texture = await Assets.load('/tilesets/Tiles/Grass_Middle.png');
      const sprite = new Sprite(texture);
      container.addChild(sprite);
      return container;
    } catch (e) {
      console.error('ExplorationScene init failed:', e, e && (e as any).message, e && (e as any).stack);
      throw e;
    }
  }

  cleanup(): void {
    console.log('Cleaning up exploration scene...');
  }
}