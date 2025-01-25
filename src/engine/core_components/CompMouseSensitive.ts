import Component from '../core/Component';

export default class CompMouseSensitive extends Component {
  constructor(
    public activate: boolean = true,
    public activate_only_if_top: boolean = false,
    public activate_on_click: boolean = true,
    public activate_on_motion: boolean = true,
  ) {
    super();
  }
}
