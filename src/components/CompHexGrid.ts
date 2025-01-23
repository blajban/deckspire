import HexGrid from '../math/hexgrid/HexGrid';
import Component from '../engine/core/Component';

export default class CompHexGrid extends Component {
  constructor(public hexgrid: HexGrid) {
    super();
  }
}
