import Component from '../core/Component';

export default class CompMouseSensitive extends Component {
  /**
   * @param mouse_depth - Not the same as the drawing depth.
   * @param should_activate
   * @param should_activate_even_if_not_on_top
   * @param should_activate_on_click
   * @param should_activate_on_move
   */
  constructor(
    public mouse_depth: number = 0,
    public should_activate: boolean = true,
    public should_activate_even_if_not_on_top: boolean = false,
    public should_activate_on_click: boolean = true,
    public should_activate_on_move: boolean = true,
  ) {
    super();
  }
}
