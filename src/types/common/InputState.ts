import type { KeyCode } from './KeyCode';

export interface InputState {
  pressed: Set<KeyCode>;
  justPressed: Set<KeyCode>;
  justReleased: Set<KeyCode>;
}