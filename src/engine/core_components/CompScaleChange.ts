import Vector2D from '../../math/Vector2D';
import Component from '../core/Component';

export default class CompScaleChange extends Component {
  public elapsed: number = 0;

  constructor(
    public duration: number,
    public start_value: Vector2D,
    public end_value: Vector2D,
    public should_loop: boolean,
    public is_playing: boolean,
  ) {
    super();
  }
}
