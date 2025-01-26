import Component from '../core/Component';

export default class CompMouseSensitive extends Component {
  constructor(
    public activate: boolean = true,
    public activate_even_if_not_on_top: boolean = false,
    public activate_on_click: boolean = true,
    public activate_on_move: boolean = true,
  ) {
    super();
  }
}
