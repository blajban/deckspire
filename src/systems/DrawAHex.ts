import CompHex from "../components/CompHex";
import CompHexGrid from "../components/CompHexGrid";
import CompTransform from "../components/CompTransform";
import System from "../engine/core/System"
import World from "../engine/core/World";
import CompChild from "../engine/core_components/CompChild";
import CompDrawable from "../engine/core_components/CompDrawable";

export default class DrawAHex extends System{
    constructor(){
        super();
    }
    update(world: World, time: number, delta: number){
      world.getEntitiesWithArchetype(CompDrawable, CompHex, CompChild).forEach((entity) => {
        const hex_coordinates = world.getComponent(entity, CompHex)?.coordinates;
        const parent = world.getComponent(entity, CompChild)?.parent;
        console.log(hex_coordinates);
        console.log(parent);
        if (hex_coordinates === undefined || parent === undefined) throw new Error('Invalid child entity');
        let hex_grid = world.getComponent(parent,CompHexGrid)?.hexgrid;
        let transform = world.getComponent(parent,CompTransform);
        if(!hex_grid || !transform) throw new Error('Invalid parent entity');
        console.log('Just pretend we drew something nice here');
      });
    }
}