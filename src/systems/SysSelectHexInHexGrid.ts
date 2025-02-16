import CompHexGrid from '../components/CompHexGrid';
import CompSelectorHex from '../components/CompSelectorHex';
import { Archetype } from '../engine/core/ComponentStore';
import { GameContext } from '../engine/core/GameContext';
import System from '../engine/core/System';
import { CompMouseSensitive } from '../engine/core_components/CompMouse';

export default class SysSelectHexInHexGrid extends System {
  constructor() {
    super(new Archetype(CompHexGrid, CompSelectorHex, CompMouseSensitive));
  }

  update(context: GameContext, _time: number, _delta: number): void {
    context.ecs_manager
      .getEntitiesWithArchetype(this.archetypes[0])
      .forEach((entity) => {
        const mouse_sensitive = context.ecs_manager.getComponent(
          entity,
          CompMouseSensitive,
        )!;
        if (!mouse_sensitive.is_pointed_at) {
          return;
        }
        const hexgrid = context.ecs_manager.getComponent(
          entity,
          CompHexGrid,
        )!.hexgrid;
      });
  }
}
