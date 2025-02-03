import { ClassIdentifier } from '../util/ClassIdentifier';

export type ComponentClass<T extends Component> = ClassIdentifier<T>;

export default abstract class Component {
  toJson(): Record<string, any> {
    return Object.fromEntries(Object.entries(this));
  }
}
