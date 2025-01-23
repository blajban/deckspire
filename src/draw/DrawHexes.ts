import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Entity } from '../engine/core/Entity';
import World from '../engine/core/World';
import CompChild from '../engine/core_components/CompChild';
import CompDrawable from '../engine/core_components/CompDrawable';
import { DrawSubSystem } from '../systems/SysDraw';

export class DrawHexGrid extends DrawSubSystem {
  constructor() {
    super([CompDrawable, CompHexGrid, CompTransform]);
  }
  
  update(world: World, time: number, delta: number, entity: Entity) {
    let hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    let transform = world.getComponent(entity, CompTransform)!;
    console.log('Just pretend we drew something nice here');
  }
}

export class DrawHex extends DrawSubSystem {
  constructor() {
    super([CompDrawable, CompHex, CompChild]);
  }

  update(world: World, time: number, delta: number, entity: Entity) {
    const hex_coordinates = world.getComponent(entity, CompHex)!.coordinates;
    const parent = world.getComponent(entity, CompChild)!.parent;
    let hex_grid = world.getComponent(parent, CompHexGrid)!.hexgrid;
    let transform = world.getComponent(parent, CompTransform);
    if (!transform) throw new Error('Parent does not have a transform component');
    console.log('Just pretend we drew something nice here');
  }
}
