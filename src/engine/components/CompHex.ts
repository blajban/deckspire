import { HexCoordinates } from '../../math/hexgrid/HexVectors';
import Component from '../core/Component';

/**
 * Represents a hex in a hex grid.
 */
export default class CompHex extends Component {
  /**
   * @param {HexCoordinates} coordinates - The coordinates of the hex.
   */
  constructor(public coordinates: HexCoordinates) {
    super();
  }
}
