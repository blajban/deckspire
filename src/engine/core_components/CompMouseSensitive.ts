import Component from '../core/Component';

export default class CompMouseSensitive extends Component {
  /**
   * @param mouse_depth - Not the same as the drawing depth.
   * @param activate 
   * @param activate_even_if_not_on_top 
   * @param activate_on_click 
   * @param activate_on_move 
   */
  constructor(
    public mouse_depth: number = 0,
    public activate: boolean = true,
    public activate_even_if_not_on_top: boolean = false,
    public activate_on_click: boolean = true,
    public activate_on_move: boolean = true,
  ) {
    super();
  }
}
