/**
 * Abstract base class for components.
 * All components must define a static `type` property to identify their type.
 */
export abstract class Component {
  static type: string;

  constructor() {
    // Make sure the subclass has defined the static `type` property.
    const ctor = this.constructor as typeof Component;
    if (ctor.type === undefined) {
      throw new Error(`Static 'type' must be defined in ${ctor.name}.`);
    }
  }
}
