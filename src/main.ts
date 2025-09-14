import { Game } from '@wild-bonds/core/Game';
import { BattleScene } from '@wild-bonds/scenes/BattleScene';
import { ExplorationScene } from '@wild-bonds/scenes/ExplorationScene';
import { GameConfig } from '@wild-bonds/types/common/GameConfig';
import { GraphicsManager } from './graphics/GraphicsManager';

// Game configuration
const gameConfig: GameConfig = {
  canvasId: 'game-canvas',
  width: 800,
  height: 600,
  tileSize: 32,
  debugMode: true
};

const graphicsManager = new GraphicsManager(window.innerWidth, window.innerHeight);

async function initializeGame(): Promise<void> {
  try {
    // Create game instance
    const game = new Game(gameConfig);

    // Create and register scenes
    const explorationScene = new ExplorationScene(game);
    const battleScene = new BattleScene(game);

    game.getSceneManager().registerScene('exploration', explorationScene);
    game.getSceneManager().registerScene('battle', battleScene);

    // Start with exploration scene
    await game.getSceneManager().switchToScene('exploration');

    // Start the game loop
    game.start();

    console.log('Wild Bonds game initialized successfully!');

    // Global game access for debugging
    (window as any).game = game;

  } catch (error) {
    console.error('Failed to initialize game:', error);

    // Show error to user
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div style="color: red; text-align: center; padding: 50px;">
          <h2>Failed to load game</h2>
          <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p>Please refresh the page to try again.</p>
        </div>
      `;
    }
  }
}

// Using graphicsManager to render the graphics
graphicsManager.render();

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  initializeGame();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  const game = (window as any).game;
  if (game && typeof game.stop === 'function') {
    game.stop();
  }
});