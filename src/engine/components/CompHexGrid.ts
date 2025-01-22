import HexGrid from '../../math/hexgrid/HexGrid';
import { Component } from '../core/Component';

export class CompHexGrid extends Component {
  constructor(public hexgrid: HexGrid) {
    super();
  }
}
