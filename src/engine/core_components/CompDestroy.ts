import Component from '../core/Component';
import Scene from '../core/Scene';

export class CompDestroyMe extends Component {}

export class CompDestroyWithScene extends Component {
  constructor(public scene: Scene) {
    super();
  }
}
