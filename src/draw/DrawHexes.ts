import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import Engine from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompChild from '../engine/core_components/CompChild';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompFillStyle from '../engine/core_components/CompFillStyle';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import {
  DrawSubSystem,
  GraphicsCacheObject,
} from '../engine/core_systems/SysDraw';
import HexGrid from '../math/hexgrid/HexGrid';
import { HexCoordinates } from '../math/hexgrid/HexVectors';

/**
 * Draws a hex grid.
 */
export class DrawHexGrid extends DrawSubSystem {
  constructor() {
    super([[CompDrawable, CompHexGrid, CompTransform]]);
  }

  /**
   * The cached Graphics object must be cleared before drawing to it again.
   * @param scene
   * @param engine
   * @param cache
   * @param time
   * @param delta
   * @param entity
   */
  update(
    scene: Scene,
    engine: Engine,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const drawable = scene.ecs.getComponent(entity, CompDrawable)!;
    const hex_grid = scene.ecs.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = scene.ecs.getComponent(entity, CompTransform)!;
    const line_style = scene.ecs.getComponent(entity, CompLineStyle);
    const fill_style = scene.ecs.getComponent(entity, CompFillStyle);

    if (!cache.graphics_object) {
      cache.graphics_object = engine.add.graphics();
    }
    const gfx = cache.graphics_object;
    gfx.clear();
    gfx.setDepth(drawable.depth);

    hex_grid.all_hexes.forEach((hex) => {
      drawHex(gfx, hex, hex_grid, transform, line_style, fill_style);
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
    scene: Scene,
    engine: Engine,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const drawable = scene.ecs.getComponent(entity, CompDrawable)!;
    const hex = scene.ecs.getComponent(entity, CompHex)!.coordinates;
    const line_style = scene.ecs.getComponent(entity, CompLineStyle);
    const fill_style = scene.ecs.getComponent(entity, CompFillStyle);
    const parent = scene.ecs.getComponent(entity, CompChild)!.parent;
    const hex_grid = scene.ecs.getComponent(parent, CompHexGrid)!.hexgrid;
    const transform = scene.ecs.getComponent(parent, CompTransform);
    if (!transform) {
      throw new Error('Parent does not have a transform component');
    }

    if (!cache.graphics_object) {
      cache.graphics_object = engine.add.graphics();
    }
    const gfx = cache.graphics_object;
    gfx.clear();
    gfx.setDepth(drawable.depth);

    drawHex(gfx, hex, hex_grid, transform, line_style, fill_style);
  }
}

function drawHex(
  gfx: Phaser.GameObjects.Graphics,
  hex: HexCoordinates,
  hex_grid: HexGrid,
  transform: CompTransform,
  line_style: CompLineStyle | null = null,
  fill_style: CompFillStyle | null = null,
): void {
  const hex_center = hex_grid
    .vector2dFromHexDistance(hex.distanceFromOrigin())
    .multiply(transform.scale)
    .add(transform.position);
  if (!fill_style && !line_style) {
    console.warn(
      'Warning: Hex entity lacks both FillStyle and LineStyle components.',
    );
    return;
  }
  if (fill_style) {
    gfx.fillStyle(fill_style.color, fill_style.alpha);
    gfx.fillEllipse(
      hex_center.x,
      hex_center.y,
      transform.scale.x * hex_grid.size,
      transform.scale.y * hex_grid.size,
    );
  }
  // Draw lines on top of fill, if any.
  if (line_style) {
    gfx.lineStyle(line_style.width, line_style.color, line_style.alpha);
    gfx.strokeEllipse(
      hex_center.x,
      hex_center.y,
      transform.scale.x * hex_grid.size - line_style.width / 2,
      transform.scale.y * hex_grid.size - line_style.width / 2,
    );
  }
}
