import Vector2D from '../math/Vector2D';
import Component from '../engine/core/Component';

export default class CompTransform extends Component {
  /**
   * @param {Vector2D} position - Center of the object.
   * @param {number} [rotation = 0] - in radians.
   * @param {Vector2D} [scale = (1,1)] - Scales x- and y-size separately
   */
  constructor(
    public position: Vector2D,
    public rotation: number = 0,
    public scale: Vector2D = new Vector2D(1, 1),
  ) {
    super();
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  public getLocalCoordinates(world_coordinates: Vector2D): Vector2D {
    return world_coordinates
      .clone()
      .subtract(this.position)
      .rotate(-this.rotation)
      .divide(this.scale);
  }
}
