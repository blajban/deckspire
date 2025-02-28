import Component, { ComponentClass } from '../core/Component';
import Scene from '../core/Scene';

export class CompDestroyMe extends Component {}

export class CompDestroyWithParent extends Component {}

export class CompDestroyWithLastChild extends Component {}

export class CompDestroyWithScene extends Component {
  constructor(public scene: Scene) {
    super();
  }
}

export class CompDestroyComp extends Component {
  constructor(public components: ComponentClass[]) {
    super();
  }
}
