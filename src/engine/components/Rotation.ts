import { Component } from "./Component";

export class Rotation extends Component {
  static type = 'Rotation';

  constructor(public rotation: number) {
    super();
  }
}
