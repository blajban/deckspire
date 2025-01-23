import Component from '../core/Component';
import { Entity } from '../core/Entity';

export default class CompChild extends Component {
  constructor(public parent: Entity) {
    super();
  }
}
