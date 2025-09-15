import { Direction } from '@wild-bonds/types/common/Direction';
import { InputState } from '@wild-bonds/types/common/InputState';
import { KeyCode } from '@wild-bonds/types/common/KeyCode';

export class InputManager {
  #currentState: InputState;
  #previousState: InputState;

  constructor() {
    this.#currentState = {
      pressed: new Set(),
      justPressed: new Set(),
      justReleased: new Set()
    };

    this.#previousState = {
      pressed: new Set(),
      justPressed: new Set(),
      justReleased: new Set()
    };

    this.#bindEvents();
  }

  /**
   * Updates the input state. Should be called once per frame.
   */
  update(): void {
    // Clear previous frame's just pressed/released
    this.#currentState.justPressed.clear();
    this.#currentState.justReleased.clear();

    // Calculate just pressed (in current but not in previous)
    for (const key of this.#currentState.pressed) {
      if (!this.#previousState.pressed.has(key)) {
        this.#currentState.justPressed.add(key);
      }
    }

    // Calculate just released (in previous but not in current)
    for (const key of this.#previousState.pressed) {
      if (!this.#currentState.pressed.has(key)) {
        this.#currentState.justReleased.add(key);
      }
    }

    // Update previous state
    this.#previousState.pressed = new Set(this.#currentState.pressed);
  }

  /**
   * Checks if a key is currently pressed.
   * @param keyCode The key code to check.
   * @returns True if the key is pressed, false otherwise.
   */
  isPressed(keyCode: KeyCode): boolean {
    return this.#currentState.pressed.has(keyCode);
  }

  /**
   * Checks if a key was just pressed.
   * @param keyCode The key code to check.
   * @returns True if the key was just pressed, false otherwise.
   */
  isJustPressed(keyCode: KeyCode): boolean {
    return this.#currentState.justPressed.has(keyCode);
  }

  /**
   * Checks if a key was just released.
   * @param keyCode The key code to check.
   * @returns True if the key was just released, false otherwise.
   */
  isJustReleased(keyCode: KeyCode): boolean {
    return this.#currentState.justReleased.has(keyCode);
  }

  /**
   * Checks if any movement keys are currently pressed.
   * @returns The direction of movement based on currently pressed keys, or null if no movement keys are pressed.
   */
  isMovementPressed(): Direction | null {

    if (this.isPressed('ArrowLeft') || this.isPressed('KeyA')) return 'left';
    if (this.isPressed('ArrowRight') || this.isPressed('KeyD')) return 'right';
    if (this.isPressed('ArrowUp') || this.isPressed('KeyW')) return 'up';
    if (this.isPressed('ArrowDown') || this.isPressed('KeyS')) return 'down';

    return null;
  }

  /**
   * Checks if the confirm key is just pressed.
   * @returns True if confirm key is just pressed, false otherwise.
   */
  isConfirmPressed(): boolean {
    return this.isJustPressed('Space') || this.isJustPressed('Enter');
  }

  /**
   * Checks if the cancel key is just pressed.
   * @returns True if cancel key is just pressed, false otherwise.
   */
  isCancelPressed(): boolean {
    return this.isJustPressed('Escape');
  }

  /**
   * Gets the current input state.
   * @returns The current input state (pressed, justPressed, justReleased).
   */
  getState(): InputState {
    return {
      pressed: new Set(this.#currentState.pressed),
      justPressed: new Set(this.#currentState.justPressed),
      justReleased: new Set(this.#currentState.justReleased)
    };
  }

  #bindEvents(): void {
    document.addEventListener('keydown', this.#onKeyDown.bind(this));
    document.addEventListener('keyup', this.#onKeyUp.bind(this));

    // Prevent default behavior for game keys
    document.addEventListener('keydown', (e) => {
      if (this.#isGameKey(e.code as KeyCode)) {
        e.preventDefault();
      }
    });
  }

  #isGameKey(keyCode: KeyCode): boolean {
    const gameKeys: KeyCode[] = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'Space', 'Enter', 'Escape',
      'Digit1', 'Digit2', 'Digit3', 'Digit4'
    ];

    return gameKeys.includes(keyCode);
  }

  #onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.code as KeyCode;
    if (this.#isGameKey(keyCode)) {
      this.#currentState.pressed.add(keyCode);
    }
  }

  #onKeyUp(event: KeyboardEvent): void {
    const keyCode = event.code as KeyCode;
    if (this.#isGameKey(keyCode)) {
      this.#currentState.pressed.delete(keyCode);
    }
  }
}