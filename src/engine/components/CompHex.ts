import { HexCoordinates } from '../../math/hexgrid/HexVectors';
import { Component } from '../core/Component';
import { Entity } from '../core/Entity';

/**
 * Represents a hex in a hex grid.
 */
export class CompHex implements Component {
  /**
   * @param {Entity} hexgrid - Identifier of the hex grid this hex belongs to.
   * @param {HexCoordinates} coordinates - The coordinates of the hex.
   */
  constructor(
    public hexgrid: Entity,
    public coordinates: HexCoordinates,
  ) {}
}
