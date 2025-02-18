import { ClassType } from '../util/ClassType';

export type ComponentClass = ClassType<Component>;

export default abstract class Component {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJson(): Record<string, any> {
    return Object.fromEntries(Object.entries(this));
  }
}
