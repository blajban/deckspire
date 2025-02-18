import Vector2D from '../../math/Vector2D';
import EcsManager from '../core/EcsManager';

export class MouseState {
  constructor(
    public position: Vector2D = new Vector2D(0, 0),
    public mouse_buttons_states: Map<number, MouseButtonStatus> = new Map(),
  ) {}

  public clone(): MouseState {
    return new MouseState(
      this.position.clone(),
      new Map(this.mouse_buttons_states),
    );
  }

  public updateMouseStatus(ecs: EcsManager): [boolean, boolean] {
    const pointer = ecs.phaser_scene.input.activePointer;
    return [
      this._updatePosition(pointer.position),
      this._updateMouseButtonsState(pointer.buttons),
    ];
  }

  private _updatePosition(position: Vector2D): boolean {
    if (!position.equals(this.position)) {
      this.position = position.clone();
      return true;
    }
    return false;
  }

  private _updateMouseButtonsState(buttons: number): boolean {
    let has_changed = false;
    for (let n = 1; n <= 16; n *= 2) {
      const old_state =
        this.mouse_buttons_states.get(n) ?? MouseButtonStatus.None;
      const is_pressed_old =
        old_state === MouseButtonStatus.Held ||
        old_state === MouseButtonStatus.Down;
      const is_pressed_new = (buttons & n) > 0;
      let state;
      if (is_pressed_old && !is_pressed_new) {
        state = MouseButtonStatus.Up;
      } else if (!is_pressed_old && is_pressed_new) {
        state = MouseButtonStatus.Down;
      } else if (is_pressed_old && is_pressed_new) {
        state = MouseButtonStatus.Held;
      } else {
        state = MouseButtonStatus.None;
      }
      has_changed = has_changed || state !== old_state;
      this.mouse_buttons_states.set(n, state);
    }
    return has_changed;
  }

  /**
   * @param {number} button - Which button to get status for, starting at 0 for the left mouse button.
   * @returns - The status of the button or the None state if the button does not exist.
   */
  public mouseButtonState(button: number): MouseButtonStatus {
    return (
      this.mouse_buttons_states.get(Math.pow(2, button)) ??
      MouseButtonStatus.None
    );
  }
}

export enum MouseButtonStatus {
  None, // Neutral unpressed state
  Down, // Pressed state
  Held, // Pressed state and was Down or Helf last frame.
  Up, // Unpressed state, but was Down or Held last frame
}
