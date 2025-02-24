import Component from '../core/Component';

export default class CompRotate extends Component {
  public elapsed: number = 0;

  constructor(
    public duration: number,
    public start_value: number,
    public end_value: number,
    public should_loop: boolean,
    public is_playing: boolean,
  ) {
    super();
  }
}
