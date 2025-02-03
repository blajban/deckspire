import Phaser from 'phaser';
import { Context } from './Engine';

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
  private _context: Context;
  private _current_id: AssetId = 0;
  private _loading_promises: Map<AssetId, Promise<void>> = new Map();

  constructor(context: Context) {
    this._context = context;
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

  private async _loadAssetAsync(id: AssetId): Promise<void> {
    if (this.isAssetLoaded(id)) {
      return Promise.resolve();
    }
  
    if (this._loading_promises.has(id)) {
      console.log('Still loading...');
      return this._loading_promises.get(id)!;
    }
  
    const asset_data = this._getAssetData(id);
    const loader = this._context.phaserContext!.load;
  
    console.log(`Starting loader for asset: ${asset_data.key}`);
  
    const promise = new Promise<void>((resolve, reject) => {
      const onComplete = () => {
        console.log(`All assets finished loading!`);
        loader.off(Phaser.Loader.Events.COMPLETE, onComplete);
        loader.off(Phaser.Loader.Events.FILE_LOAD_ERROR, onFileError);
        this._loaded_assets.add(id);
        this._loading_promises.delete(id);
        resolve();
      };
  
      const onFileError = (fileKey: string) => {
        if (fileKey === asset_data.key) {
          console.error(`Error loading asset: ${fileKey}`);
          loader.off(Phaser.Loader.Events.FILE_LOAD_ERROR, onFileError);
          this._loading_promises.delete(id);
          reject(new Error(`Failed to load asset with key ${asset_data.key}`));
        }
      };
  
      loader.once(Phaser.Loader.Events.COMPLETE, onComplete);
      loader.once(Phaser.Loader.Events.FILE_LOAD_ERROR, onFileError);
  
      switch (asset_data.type) {
        case AssetType.Image:
          loader.image(asset_data.key, asset_data.path);
          break;
        case AssetType.Spritesheet:
          loader.spritesheet(asset_data.key, asset_data.path, asset_data.frameConfig);
          break;
        case AssetType.Audio:
          loader.audio(asset_data.key, asset_data.path);
          break;
        case AssetType.Font:
          loader.bitmapFont(asset_data.key, asset_data.path);
          break;
        default:
          reject(new Error(`Unknown asset type: ${(asset_data as AssetData).type}`));
          return;
      }
  
      if (!loader.isLoading()) {
        loader.start();
      }
    });
  
    this._loading_promises.set(id, promise);
    return promise;
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

  public async preloadAssets(keys?: AssetKey[]): Promise<void> {
    console.log('Preloading assets in AssetStore...');
    
    const asset_ids_to_load = keys
      ? keys.map((key) => this.getAssetId(key)).filter((id) => !this.isAssetLoaded(id))
      : Array.from(this._key_to_id.values()).filter((id) => !this.isAssetLoaded(id));
  
    console.log('Assets to load:', asset_ids_to_load);
  
    await Promise.all(asset_ids_to_load.map(async (id) => {
      console.log(`Loading asset ID: ${id}`);
      await this._loadAssetAsync(id);
      console.log(`Asset ID ${id} finished loading!`);
    }));
  
    console.log('All assets loaded!');
  }
  

  public isAssetLoaded(id: AssetId): boolean {
    return this._loaded_assets.has(id);
  }

  public useAsset(id: AssetId): void {
    this._asset_usage_count.set(id, (this._asset_usage_count.get(id) || 0) + 1);
  }

  public releaseAsset(id: AssetId): void {
    if (!this._asset_usage_count.has(id)) {
      throw new Error(`Attempted to release non-existent asset ID ${id}`);
    }

    const count = this._asset_usage_count.get(id) || 0;
    if (count <= 1) {
      this.unloadAsset(id);
      this._asset_usage_count.delete(id);
    } else {
      this._asset_usage_count.set(id, count - 1);
    }
  }

  public getAsset(id: AssetId): AssetKey | null {
    if (!this.isAssetLoaded(id)) {
      return null;
    }

    return this._getAssetData(id).key;
  }

  public getAssetId(key: AssetKey): AssetId {
    const asset_id = this._key_to_id.get(key);
    if (asset_id === undefined) {
      throw new Error(`Asset with key ${key} is not registered.`);
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
        this._context.phaserContext!.textures.remove(asset_data.key);
        break;
      case AssetType.Audio:
        this._context.phaserContext!.sound.removeByKey(asset_data.key);
        break;
      case AssetType.Font:
        // Font unloading not supported by Phaser
        break;
      default:
        throw new Error(
          `Unknown asset type: ${(asset_data as AssetData).type}`,
        );
    }

    this._loaded_assets.delete(id);
  }
}
