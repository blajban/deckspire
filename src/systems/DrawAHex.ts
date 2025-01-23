import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import System from '../engine/core/System';
import World from '../engine/core/World';
import CompChild from '../engine/core_components/CompChild';
import CompDrawable from '../engine/core_components/CompDrawable';

export default class DrawAHex extends System {
  constructor() {
    super();
  }
  update(world: World, time: number, delta: number) {
    world
      .getEntitiesWithArchetype(CompDrawable, CompHexGrid, CompTransform)
      .forEach((entity) => {
        let hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
        let transform = world.getComponent(entity, CompTransform)!;
        console.log('Just pretend we drew something nice here');
      });
    world
      .getEntitiesWithArchetype(CompDrawable, CompHex, CompChild)
      .forEach((entity) => {
        const hex_coordinates = world.getComponent(
          entity,
          CompHex,
        )!.coordinates;
        const parent = world.getComponent(entity, CompChild)!.parent;
        let hex_grid = world.getComponent(parent, CompHexGrid)!.hexgrid;
        let transform = world.getComponent(parent, CompTransform);
        if (!transform)
          throw new Error('Parent does not have a transform component');
        console.log('Just pretend we drew something nice here');
      });
  }
}
