import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import World from '../engine/core/World';
import CompChild from '../engine/core_components/CompChild';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompFillStyle from '../engine/core_components/CompFillStyle';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import { DrawSubSystem } from '../systems/SysDraw';

export class DrawHexGrid extends DrawSubSystem {
  constructor() {
    super([CompDrawable, CompHexGrid, CompTransform]);
  }

  update(
    world: World,
    scene: Scene,
    time: number,
    delta: number,
    entity: Entity,
  ) {
    let hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    let transform = world.getComponent(entity, CompTransform)!;

    console.log('Just pretend we drew something nice here');
  }
}

export class DrawHex extends DrawSubSystem {
  constructor() {
    super([CompDrawable, CompHex, CompChild]);
  }

  update(
    world: World,
    scene: Scene,
    time: number,
    delta: number,
    entity: Entity,
  ) {
    const drawable = world.getComponent(entity, CompDrawable)!;
    const hex_coordinates = world.getComponent(entity, CompHex)!.coordinates;
    const line_style = world.getComponent(entity, CompLineStyle);
    const fill_style = world.getComponent(entity, CompFillStyle);
    const parent = world.getComponent(entity, CompChild)!.parent;
    let hex_grid = world.getComponent(parent, CompHexGrid)!.hexgrid;
    let transform = world.getComponent(parent, CompTransform);
    if (!transform)
      throw new Error('Parent does not have a transform component');

    if (!drawable.draw_object) {
      drawable.draw_object = scene.add.graphics();
    }
    const gfx = drawable.draw_object;
    gfx.setDepth(drawable.depth);
    let hex_center = hex_grid
      .vector2d_from_hex_distance(
        hex_coordinates.distance_from_origin().multiply(transform.scale),
      )
      .add(transform.position);

    if (line_style) {
      gfx.lineStyle(line_style.width, line_style.color, line_style.alpha);
      gfx.strokeCircle(hex_center.x, hex_center.y, transform.scale / 2);
    }
    if (fill_style) {
      gfx.fillStyle(fill_style.color, fill_style.alpha);
      gfx.fillCircle(hex_center.x, hex_center.y, transform.scale / 2);
    }

    console.log('Just pretend we drew something nice here');
  }
}
