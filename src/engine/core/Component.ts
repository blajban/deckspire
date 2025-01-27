/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ComponentClass<T> = new (...args: any[]) => T;

export default abstract class Component {
  toJSON(): Record<string, any> {
    return Object.fromEntries(Object.entries(this));
  }
}
