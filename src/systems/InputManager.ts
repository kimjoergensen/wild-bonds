import { InputState } from '@wild-bonds/types/common/InputState';
import { KeyCode } from '@wild-bonds/types/common/KeyCode';

export class InputManager {
  private currentState: InputState;
  private previousState: InputState;

  constructor() {
    this.currentState = {
      pressed: new Set(),
      justPressed: new Set(),
      justReleased: new Set()
    };

    this.previousState = {
      pressed: new Set(),
      justPressed: new Set(),
      justReleased: new Set()
    };

    this.bindEvents();
  }

  private bindEvents(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));

    // Prevent default behavior for game keys
    document.addEventListener('keydown', (e) => {
      if (this.isGameKey(e.code as KeyCode)) {
        e.preventDefault();
      }
    });
  }

  private isGameKey(keyCode: KeyCode): boolean {
    const gameKeys: KeyCode[] = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'Space', 'Enter', 'Escape',
      'Digit1', 'Digit2', 'Digit3', 'Digit4'
    ];

    return gameKeys.includes(keyCode);
  }

  private onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.code as KeyCode;
    if (this.isGameKey(keyCode)) {
      this.currentState.pressed.add(keyCode);
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    const keyCode = event.code as KeyCode;
    if (this.isGameKey(keyCode)) {
      this.currentState.pressed.delete(keyCode);
    }
  }

  update(): void {
    // Clear previous frame's just pressed/released
    this.currentState.justPressed.clear();
    this.currentState.justReleased.clear();

    // Calculate just pressed (in current but not in previous)
    for (const key of this.currentState.pressed) {
      if (!this.previousState.pressed.has(key)) {
        this.currentState.justPressed.add(key);
      }
    }

    // Calculate just released (in previous but not in current)
    for (const key of this.previousState.pressed) {
      if (!this.currentState.pressed.has(key)) {
        this.currentState.justReleased.add(key);
      }
    }

    // Update previous state
    this.previousState.pressed = new Set(this.currentState.pressed);
  }

  isPressed(keyCode: KeyCode): boolean {
    return this.currentState.pressed.has(keyCode);
  }

  isJustPressed(keyCode: KeyCode): boolean {
    return this.currentState.justPressed.has(keyCode);
  }

  isJustReleased(keyCode: KeyCode): boolean {
    return this.currentState.justReleased.has(keyCode);
  }

  // Convenience methods for common input patterns
  isMovementPressed(): { x: number; y: number; } {
    let x = 0;
    let y = 0;

    if (this.isPressed('ArrowLeft') || this.isPressed('KeyA')) x -= 1;
    if (this.isPressed('ArrowRight') || this.isPressed('KeyD')) x += 1;
    if (this.isPressed('ArrowUp') || this.isPressed('KeyW')) y -= 1;
    if (this.isPressed('ArrowDown') || this.isPressed('KeyS')) y += 1;

    return { x, y };
  }

  isConfirmPressed(): boolean {
    return this.isJustPressed('Space') || this.isJustPressed('Enter');
  }

  isCancelPressed(): boolean {
    return this.isJustPressed('Escape');
  }

  getState(): InputState {
    return {
      pressed: new Set(this.currentState.pressed),
      justPressed: new Set(this.currentState.justPressed),
      justReleased: new Set(this.currentState.justReleased)
    };
  }
}