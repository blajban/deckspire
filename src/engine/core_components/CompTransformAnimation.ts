import Animate, { Anim, AnimKey } from '../core/Animations';
import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';
import Component from '../core/Component';

export default class CompTransformAnimation extends Component {
  public animate: Animate;

  constructor(
    animations: Anim[],
    default_state_key: AnimKey
  ) {
    super();
    this.animate = new Animate(null, animations, default_state_key);
  }
}