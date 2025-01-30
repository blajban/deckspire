import Engine from './Engine';

export type AssetId = number;
export type AssetKey = string;

export enum AssetType {
  Image = 'image',
  Spritesheet = 'spritesheet',
  Audio = 'audio',
  Font = 'font',
}

export interface FrameConfig {
  frameWidth: number;
  frameHeight: number;
}

export interface BaseAssetData {
  key: AssetKey;
  path: string;
  type: AssetType;
}

export interface ImageAssetData extends BaseAssetData {
  type: AssetType.Image;
}

export interface SpriteSheetAssetData extends BaseAssetData {
  type: AssetType.Spritesheet;
  frameConfig: FrameConfig;
}

export interface AudioAssetData extends BaseAssetData {
  type: AssetType.Audio;
}

export interface FontAssetData extends BaseAssetData {
  type: AssetType.Font;
}

export type AssetData =
  | ImageAssetData
  | SpriteSheetAssetData
  | AudioAssetData
  | FontAssetData;

export default class AssetStore {
  private _registered_assets: Map<AssetId, AssetData> = new Map();
  private _key_to_id: Map<AssetKey, AssetId> = new Map();
  private _loaded_assets: Set<AssetId> = new Set();
  private _asset_usage_count: Map<AssetId, number> = new Map();
  private _engine: Engine;
  private _current_id: AssetId = 0;

  constructor(engine: Engine) {
    this._engine = engine;
  }

  private _nextId(): AssetId {
    return this._current_id++;
  }

  private _getAssetData(id: AssetId): AssetData {
    const asset_data = this._registered_assets.get(id);
    if (!asset_data) {
      throw new Error(`Asset with id ${id} must be registered first.`);
    }
    return asset_data;
  }

  private _loadAsset(id: AssetId): void {
    if (this.isAssetLoaded(id)) {
      return;
    }

    const asset_data = this._getAssetData(id);

    switch (asset_data.type) {
      case AssetType.Image:
        this._engine.getPhaserContext().load.image(asset_data.key, asset_data.path);
        break;

      case AssetType.Spritesheet:
        this._engine.getPhaserContext().load.spritesheet(
          asset_data.key,
          asset_data.path,
          asset_data.frameConfig,
        );
        break;

      case AssetType.Audio:
        this._engine.getPhaserContext().load.audio(asset_data.key, asset_data.path);
        break;

      case AssetType.Font:
        this._engine.getPhaserContext().load.bitmapFont(asset_data.key, asset_data.path);
        // Todo: web fonts
        break;

      default:
        throw new Error(
          `Unknown asset type: ${(asset_data as AssetData).type}`
        );
    }

    this._loaded_assets.add(id);
  }

  public registerAsset(asset: AssetData): AssetId {
    if (this._key_to_id.has(asset.key)) {
      throw new Error(`Asset ${asset.key} is already registered.`);
    }

    const asset_id = this._nextId();
    this._key_to_id.set(asset.key, asset_id);
    this._registered_assets.set(asset_id, asset);

    return asset_id;
  }

  public registerAssets(assets: AssetData[]): void {
    assets.forEach((asset) => {
      if (this._key_to_id.has(asset.key)) {
        throw new Error(`Asset ${asset.key} is already registered.`);
      }

      const asset_id = this._nextId();
      this._key_to_id.set(asset.key, asset_id);
      this._registered_assets.set(asset_id, asset);
    });
  }

  public preloadAssets(keys?: AssetKey[]): void {
    const asset_ids_to_load = keys
      ? keys
          .map((key) => this.getAssetId(key))
          .filter((id) => !this.isAssetLoaded(id))
      : Array.from(this._key_to_id.values()).filter(
          (id) => !this.isAssetLoaded(id),
        );

    asset_ids_to_load.forEach((id) => {
      this._loadAsset(id);
    });
  }

  public isAssetLoaded(id: AssetId): boolean {
    return this._loaded_assets.has(id);
  }

  public useAsset(id: AssetId): void {
    this._asset_usage_count.set(id, (this._asset_usage_count.get(id) || 0) + 1);
    console.log(
      `Components using asset ${id}:`,
      this._asset_usage_count.get(id),
    );
  }

  public releaseAsset(id: AssetId): void {
    if (!this._asset_usage_count.has(id)) {
      throw new Error(`Attempted to release non-existent asset ID ${id}`);
    }

    const count = this._asset_usage_count.get(id) || 0;
    if (count <= 1) {
      this.unloadAsset(id);
      this._asset_usage_count.delete(id);
      console.log(`All components released asset ${id}:`);
    } else {
      this._asset_usage_count.set(id, count - 1);
      console.log(
        `Releasing asset from component. Components using asset ${id}:`,
        this._asset_usage_count.get(id),
      );
    }
  }

  public getAsset(id: AssetId): AssetKey {
    if (!this.isAssetLoaded(id)) {
      this._loadAsset(id);
    }

    return this._getAssetData(id).key;
  }

  public getAssetId(key: AssetKey): AssetId {
    const asset_id = this._key_to_id.get(key);
    if (asset_id === undefined) {
      throw new Error(`Asset with key '${key}' is not registered.`);
    }
    return asset_id;
  }

  public unloadAsset(id: AssetId): void {
    if (!this.isAssetLoaded(id)) {
      return;
    }

    const asset_data = this._getAssetData(id);

    switch (asset_data.type) {
      case AssetType.Image:
      case AssetType.Spritesheet:
        this._engine.getPhaserContext().textures.remove(asset_data.key);
        break;
      case AssetType.Audio:
        this._engine.getPhaserContext().sound.removeByKey(asset_data.key);
        break;
      case AssetType.Font:
        // Font unloading not supported by Phaser
        break;
      default:
        throw new Error(
          `Unknown asset type: ${(asset_data as AssetData).type}`
        );
    }

    this._loaded_assets.delete(id);
  }
}
