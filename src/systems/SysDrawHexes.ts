import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Archetype } from '../engine/core/ComponentStore';
import { GameContext } from '../engine/core/GameContext';
import System from '../engine/core/System';
import CompChild from '../engine/core_components/CompChild';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompFillStyle from '../engine/core_components/CompFillStyle';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import HexGrid from '../math/hexgrid/HexGrid';
import { HexCoordinates } from '../math/hexgrid/HexVectors';

/**
 * Draws a hex grid.
 */
export class SysDrawHexGrid extends System {
  constructor() {
    super(new Archetype(CompDrawable, CompHexGrid, CompTransform));
  }

  /**
   * The cached Graphics object must be cleared before drawing to it again.
   * @param scene
   * @param context
   * @param cache
   * @param time
   * @param delta
   * @param entity
   */
  override update(context: GameContext, _time: number, _delta: number): void {
    const hex_grid_archetype = this.archetypes[0];
    context.ecs_manager
      .getEntitiesWithArchetype(hex_grid_archetype)
      .forEach((entity) => {
        const drawable = context.ecs_manager.getComponent(
          entity,
          CompDrawable,
        )!;
        const hex_grid = context.ecs_manager.getComponent(
          entity,
          CompHexGrid,
        )!.hexgrid;
        const transform = context.ecs_manager.getComponent(
          entity,
          CompTransform,
        )!;
        const line_style = context.ecs_manager.getComponent(
          entity,
          CompLineStyle,
        );
        const fill_style = context.ecs_manager.getComponent(
          entity,
          CompFillStyle,
        );

        const cache =
          context.ecs_manager.graphics_cache.getComponentCache(drawable);
        if (!cache.graphics_object) {
          cache.graphics_object = context.phaser_scene.add.graphics();
        }
        const gfx = cache.graphics_object;
        gfx.clear();
        gfx.setDepth(drawable.depth);

        if (!drawable.is_visible) {
          return;
        }

        hex_grid.all_hexes.forEach((hex) => {
          drawHex(gfx, hex, hex_grid, transform, line_style, fill_style);
        });
      });
  }

  override terminate(_context: GameContext): void {}
}

/**
 * Draws a hex in a hex grid
 */
export class DrawHex extends System {
  constructor() {
    super(new Archetype(CompDrawable, CompHex, CompChild));
  }

  override init(_context: GameContext): void {}

  override update(context: GameContext, _time: number, _delta: number): void {
    const hex_archetype = this.archetypes[0];
    context.ecs_manager
      .getEntitiesWithArchetype(hex_archetype)
      .forEach((entity) => {
        const drawable = context.ecs_manager.getComponent(
          entity,
          CompDrawable,
        )!;
        const hex = context.ecs_manager.getComponent(
          entity,
          CompHex,
        )!.coordinates;
        const line_style = context.ecs_manager.getComponent(
          entity,
          CompLineStyle,
        );
        const fill_style = context.ecs_manager.getComponent(
          entity,
          CompFillStyle,
        );
        const parent = context.ecs_manager.getComponent(
          entity,
          CompChild,
        )!.parent;
        const hex_grid = context.ecs_manager.getComponent(
          parent,
          CompHexGrid,
        )!.hexgrid;
        const transform = context.ecs_manager.getComponent(
          parent,
          CompTransform,
        );
        if (!transform) {
          throw new Error('Parent does not have a transform component');
        }

        const cache =
          context.ecs_manager.graphics_cache.getComponentCache(drawable);
        if (!cache.graphics_object) {
          cache.graphics_object = context.phaser_scene.add.graphics();
        }
        const gfx = cache.graphics_object;
        gfx.clear();
        gfx.setDepth(drawable.depth);
        if (!drawable.is_visible) {
          return;
        }

        drawHex(gfx, hex, hex_grid, transform, line_style, fill_style);
      });
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
