import Vector2D from '../../math/Vector2D';
import Component from '../core/Component';

export class CompPosition extends Component {
  constructor(public position: Vector2D) {
    super();
  }
}
