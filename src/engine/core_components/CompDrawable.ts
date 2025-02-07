import Component from '../core/Component';

export default class CompDrawable extends Component {
  constructor(
    public depth: number,
    public is_invisible = false,
  ) {
    super();
  }
}
