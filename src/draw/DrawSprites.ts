import CompTransform from '../components/CompTransform';
import Engine from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompSprite from '../engine/core_components/CompSprite';
import { DrawSubSystem, GraphicsCacheObject } from '../engine/core_systems/SysDraw';

/* export class DrawSprites extends DrawSubSystem {
  constructor() {
    super([[CompDrawable, CompSprite, CompTransform]]);
  } */

  /**
   * The cached Graphics object must be cleared before drawing to it again.
   * @param scene
   * @param engine
   * @param cache
   * @param time
   * @param delta
   * @param entity
   */
/*   update(
    scene: Scene,
    engine: Engine,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const drawable = scene.ecs.getComponent(entity, CompDrawable)!;
    const sprite = scene.ecs.getComponent(entity, CompSprite);
    const transform = scene.ecs.getComponent(entity, CompTransform)!;

    //if (!cache.graphics_object) {
    //  cache.graphics_object = engine.add.graphics();
    //}
    //const gfx = cache.graphics_object;
    //gfx.clear();
    //gfx.setDepth(drawable.depth);


    drawSprite(gfx, sprite, transform);

  }
}
 */
/* 
function drawSprite(
  phaser_sprite: Phaser.GameObjects.Sprite,
  sprite: CompSprite,
  transform: CompTransform,
): void {
  console.log('Drawing sprite!');
}
 */
