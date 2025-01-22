import { HexCoordinates } from '../../math/hexgrid/HexVectors';
import { Component } from '../core/Component';
import { Entity } from '../core/Entity';

/**
 * Represents a hex in a hex grid.
 */
export class CompHex extends Component {
  /**
   * @param {HexCoordinates} coordinates - The coordinates of the hex.
   */
  constructor(public coordinates: HexCoordinates) {
    super();
  }
}
