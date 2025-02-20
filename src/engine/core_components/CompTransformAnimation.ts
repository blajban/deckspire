import AnimStates from '../core/Animations';
import Animate, { Animation, AnimKey } from '../core/Animations';
import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';
import Component from '../core/Component';

export default class CompTransformAnimation extends Component {
  public states: AnimStates;

  constructor(
    animations: Animation[],
    default_state_key: AnimKey
  ) {
    super();
    this.states = new AnimStates(null, animations, default_state_key);
  }
}