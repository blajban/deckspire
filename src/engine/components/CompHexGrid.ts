import { HexGrid } from '../../math/hexgrid/HexGrid';
import { Component } from '../core/Component';

export class CompHexGrid implements Component {
  constructor(
    public hexgrid: HexGrid ) {}
}
