import Vector2D from '../math/Vector2D';
import Component from '../engine/core/Component';

export default class CompTransform extends Component {
  public position: Vector2D;
  public rotation: number;
  public scale: Vector2D;

  /**
   * @param {Vector2D} position - Center of the object.
   * @param {number} [rotation = 0] - in radians.
   * @param {Vector2D} [scale = (1,1)] - Scales x- and y-size separately
   */
  constructor(position: Vector2D, rotation: number = 0, scale: Vector2D = new Vector2D(1, 1)) {
    super();
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
