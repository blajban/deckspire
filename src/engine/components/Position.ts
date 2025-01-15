import { Component } from "./Component";

export class Position extends Component {
  static type = 'Position';

  constructor(public x: number, public y: number) {
    super();
  }
}
