import Component from '../core/Component';

export default class CompDrawable extends Component {
  constructor(
    public depth: number,
    public is_visible = true,
  ) {
    super();
  }
}
