import Vector2D from '../../math/Vector2D';
import Component from '../core/Component';

export default class CompTransform extends Component {
  public position: Vector2D;
  public rotation: number;
  public scale: number;
  constructor(position: Vector2D, rotation: number = 0, scale: number = 1) {
    super();
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
