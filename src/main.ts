import { Game } from '@wild-bonds/core/Game';
import { AssetsLoader } from '@wild-bonds/graphics/AssetsLoader';
import { Application } from 'pixi.js';
import { GAME_CONFIG } from './configs/Constants';

async function initializeGame(): Promise<void> {
  try {
    // Initialize PixiJS Application (v8 pattern)
    const app = new Application();
    await app.init({ width: GAME_CONFIG.width, height: GAME_CONFIG.height });

    const host = document.getElementById('app') || document.body;
    host.appendChild(app.canvas);

    // Load assets
    const assetsLoader = new AssetsLoader();
    await assetsLoader.loadAssets();

    // Start the game
    const game = new Game(app, assetsLoader);
    await game.start();

    console.log('Wild Bonds game started successfully!');

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
          ${GAME_CONFIG.debugMode
          ? `<p>${error instanceof Error
            ? error.message
            : 'Unknown error'}
            </p>`
          : ''}
          <p>Please refresh the page to try again.</p>
        </div>
      `;
    }
  }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
  });
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