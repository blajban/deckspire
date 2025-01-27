import Component from '../core/Component';

export default class CompFillStyle extends Component {
  constructor(
    public color: number,
    public alpha: number,
  ) {
    super();
  }
}
