import Phaser from "phaser";

export interface Vector2DLike {
    x: number;
    y: number;
}

/** @implements {Vector2DLike} */
export class Vector2D extends Phaser.Math.Vector2 implements Vector2DLike {}