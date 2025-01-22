import HexGrid from '../../math/hexgrid/HexGrid';
import Component from '../core/Component';

export default class CompHexGrid extends Component {
  constructor(public hexgrid: HexGrid) {
    super();
  }
}
