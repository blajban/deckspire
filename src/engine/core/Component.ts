import { ClassType } from '../util/ClassType';

export type ComponentClass = ClassType<Component>;

export default abstract class Component {
  toJson(): Record<string, any> {
    return Object.fromEntries(Object.entries(this));
  }
}
