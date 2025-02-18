import Component from '../core/Component';

export default class CompAnimation extends Component {
  public seconds_since_last_frame = 0;

  constructor(public frames_per_second: number) {
    super();
  }

  public get seconds_per_frame(): number {
    return 1 / this.frames_per_second;
  }
}
