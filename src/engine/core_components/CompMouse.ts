import Component from '../core/Component';
import { MouseState } from '../input/MouseState';

// Marker component
export class CompIsMouse extends Component {
  constructor() {
    super();
  }
}

export class CompMouseState extends Component {
  constructor(public mouse_state: MouseState) {
    super();
  }
}

export class CompMouseEvent extends Component {
  public readonly has_moved: boolean;
  public readonly has_clicked: boolean;
  constructor(has_moved = false, has_clicked = false) {
    super();
    this.has_moved = has_moved;
    this.has_clicked = has_clicked;
  }

  public get has_changed(): boolean {
    return this.has_clicked || this.has_moved;
  }
}

export class CompMouseSensitive extends Component {
  /**
   * @param mouse_depth - Not the same as the drawing depth.
   */
  constructor(
    public mouse_depth: number = 0,
    public is_pointed_at = false,
  ) {
    super();
  }
}
