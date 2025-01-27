import Component from '../core/Component';

export default class CompLineStyle extends Component {
  constructor(
    public width: number,
    public color: number,
    public alpha: number,
  ) {
    super();
  }
}
