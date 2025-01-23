import Component from '../core/Component';
import { Entity } from '../core/Entity';

export default class CompParent extends Component {
  constructor(public children: Entity[]) {
    super();
  }
}
