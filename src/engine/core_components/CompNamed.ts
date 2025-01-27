import Component from '../core/Component';

export default class CompNamed extends Component {
  constructor(public name: string = 'unnamed') {
    super();
  }
}
