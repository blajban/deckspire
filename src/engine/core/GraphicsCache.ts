import CompDrawable from '../core_components/CompDrawable';

export class GraphicsCacheObject {
  /* This is a reference to the Phaser object that will be drawn by Phaser.
   * We might need to add options for other classes in the future. */
  public graphics_object:
    | Phaser.GameObjects.Graphics
    | Phaser.GameObjects.Sprite
    | null = null;
}

export default class GraphicsCache {
  private _component_caches = new Map<CompDrawable, GraphicsCacheObject>();

  public getComponentCache(drawable: CompDrawable): GraphicsCacheObject {
    let cache = this._component_caches.get(drawable);
    if (!cache) {
      cache = new GraphicsCacheObject();
      this._component_caches.set(drawable, cache);
    }
    return cache;
  }

  public deleteCache(drawable: CompDrawable): void {
    this._component_caches.delete(drawable);
  }

  public deleteAllCache(): void {
    this._component_caches.forEach((cache, drawable) => {
      if (cache?.graphics_object) {
        cache.graphics_object.destroy();
        cache.graphics_object = null;
      }

      this._component_caches.delete(drawable);
    });
  }

  public get size(): number {
    return this._component_caches.size;
  }
}
