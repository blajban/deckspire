import AnimationStates, {
  AnimationConfig,
  AnimationKey,
} from '../core/SpriteAnimations';
import AssetComponent from '../core/AssetComponent';
import AssetStore from '../core/AssetStore';
import Component from '../core/Component';

export default class CompAnimatedSprite extends Component {
  public states: AnimationStates;

  constructor(
    asset_store: AssetStore,
    animations: AnimationConfig[],
    default_state_key: AnimationKey,
  ) {
    super();
    this.states = new AnimationStates(
      asset_store,
      animations,
      default_state_key,
    );
  }
}
