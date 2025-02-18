import Vector2D from '../math/Vector2D';
import Component from '../engine/core/Component';
import Animate, { Anim, AnimKey } from '../engine/core/Animations';

export default class CompTransform extends Component {
  public animate: Animate | null = null;

  /**
   * @param {Vector2D} position - Center of the object.
   * @param {number} [rotation = 0] - in radians.
   * @param {Vector2D} [scale = (1,1)] - Scales x- and y-size separately
   */
  constructor(
    public position: Vector2D,
    public rotation: number = 0,
    public scale: Vector2D = new Vector2D(1, 1),
    animations?: Anim[],
    default_state_key?: AnimKey
  ) {
    super();
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;

    if (animations && default_state_key) {
      this.animate = new Animate(null, animations, default_state_key);
    }
  }
}
