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
import CompNamed from '../engine/core_components/CompNamed';
import { DrawSubSystem, GraphicsCacheObject } from '../engine/core_systems/SysDraw';
import HexGrid from '../math/hexgrid/HexGrid';
import { HexCoordinates } from '../math/hexgrid/HexVectors';

/**
 * Draws a hex grid.
 */
export class DrawHexGrid extends DrawSubSystem {
  constructor() {
    super([[CompDrawable, CompHexGrid, CompTransform]]);
  }

  update(
    world: World,
    scene: Scene,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ) {
    let drawable = world.getComponent(entity, CompDrawable)!;
    let hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    let transform = world.getComponent(entity, CompTransform)!;
    const line_style = world.getComponent(entity, CompLineStyle);
    const fill_style = world.getComponent(entity, CompFillStyle);

    if (!cache.graphics_object) {
      cache.graphics_object = scene.add.graphics();
    }
    const gfx = cache.graphics_object;
    gfx.clear();
    gfx.setDepth(drawable.depth);

    hex_grid.all_hexes().forEach((hex) => {
      draw_hex(gfx, hex, hex_grid, transform, line_style, fill_style);
    });
  }
}

/**
 * Draws a hex in a hex grid
 */
export class DrawHex extends DrawSubSystem {
  constructor() {
    super([[CompDrawable, CompHex, CompChild]]);
  }

  update(
    world: World,
    scene: Scene,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ) {
    console.log(`Drawing entity named: ${world.getComponent(entity, CompNamed)?.name}`);
    const drawable = world.getComponent(entity, CompDrawable)!;
    const hex = world.getComponent(entity, CompHex)!.coordinates;
    const line_style = world.getComponent(entity, CompLineStyle);
    const fill_style = world.getComponent(entity, CompFillStyle);
    const parent = world.getComponent(entity, CompChild)!.parent;
    let hex_grid = world.getComponent(parent, CompHexGrid)!.hexgrid;
    let transform = world.getComponent(parent, CompTransform);
    if (!transform)
      throw new Error('Parent does not have a transform component');

    if (!cache.graphics_object) {
      cache.graphics_object = scene.add.graphics();
    }
    const gfx = cache.graphics_object;
    gfx.clear();
    gfx.setDepth(drawable.depth);

    draw_hex(gfx, hex, hex_grid, transform, line_style, fill_style);
  }
}

function draw_hex(
  gfx: Phaser.GameObjects.Graphics,
  hex: HexCoordinates,
  hex_grid: HexGrid,
  transform: CompTransform,
  line_style: CompLineStyle | null = null,
  fill_style: CompFillStyle | null = null,
) {
  let hex_center = hex_grid
    .vector2d_from_hex_distance(hex.distance_from_origin())
    .multiply(transform.scale)
    .add(transform.position);
  if( !fill_style && !line_style){
    console.warn('Warning: Hex entity lacks both FillStyle and LineStyle components.');
    return;
  }
  if (fill_style) {
    gfx.fillStyle(fill_style.color, fill_style.alpha);
    gfx.fillEllipse(
      hex_center.x,
      hex_center.y,
      transform.scale.x * hex_grid.size(),
      transform.scale.y * hex_grid.size(),
    );
  }
  // Draw lines on top of fill, if any.
  if (line_style) {
    gfx.lineStyle(line_style.width, line_style.color, line_style.alpha);
    gfx.strokeEllipse(
      hex_center.x,
      hex_center.y,
      transform.scale.x * hex_grid.size() - line_style.width / 2,
      transform.scale.y * hex_grid.size() - line_style.width / 2,
    );
  }
}
