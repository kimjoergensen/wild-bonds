import { GameConfig } from '@wild-bonds/types/common/GameConfig';
import { Application } from 'pixi.js';
import { Game } from './core/Game';

// Game configuration
const gameConfig: GameConfig = {
  width: 640,
  height: 512,
  tileSize: 16,
  debugMode: true
};

async function initializeGame(): Promise<void> {
  try {
    // Initialize PixiJS Application (v8 pattern)
    const app = new Application();
    await app.init({ width: gameConfig.width, height: gameConfig.height });

    const host = document.getElementById('app') || document.body;
    host.appendChild(app.canvas);

    // Start the game
    const game = new Game(gameConfig, app);
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
          ${gameConfig.debugMode
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