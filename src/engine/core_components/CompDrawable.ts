import Component from '../core/Component';

export default class CompDrawable extends Component {
  // This is a reference to the Phaser object that will be drawn by Phaser. Might need to add options for other classes or just use a GameObject reference in the future.
  public draw_object: Phaser.GameObjects.Graphics | null = null;
  constructor(public depth: number) {
    super();
  }
}
