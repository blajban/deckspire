import { ClassType } from '../util/ClassType';
import Component from './Component';

/* keyof T is a union of all properties of T.
 * K is a property of T.
 * T[K] is the value corresponding to the property K in T.
 */
export type ComponentClassTuple<T> = { [K in keyof T]: ClassType<T[K]> };

export default class Archetype<T extends Component[]> {
  public readonly component_classes: ComponentClassTuple<T>;
  constructor(...component_classes: ComponentClassTuple<T>) {
    this.component_classes = component_classes;
  }
}
