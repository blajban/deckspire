import { Component } from "../../src/engine/components/Component";


class ValidComponent extends Component {
  static type = 'ValidComponent';
}

class InvalidComponent extends Component {
  // No static type defined
}

describe('Component Class', () => {
  test('should not throw an error when static type is defined', () => {
    expect(() => new ValidComponent()).not.toThrow();
  });

  test('should throw an error when static type is not defined', () => {
    expect(() => new InvalidComponent()).toThrow(
      "Static 'type' must be defined in InvalidComponent."
    );
  });

  test('static type should be accessible on subclasses', () => {
    expect(ValidComponent.type).toBe('ValidComponent');
  });

  test('should throw a runtime error for direct instantiation of base Component', () => {
    // Create a mock subclass without `type` defined
    class MockComponent extends Component {}

    expect(() => new MockComponent()).toThrow(
      "Static 'type' must be defined in MockComponent."
    );
  });
});
