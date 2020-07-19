import { inject, injectable } from "inversify";
import { IConfigProvider } from "../config/IConfigProvider";
import { TYPES } from "../di/types";
import { ICacheManager } from "../helpers/interfaces/ICacheManager";
import { ISceneBuilder } from "./interfaces/ISceneBuilder";
import { ITexturePainter } from "./interfaces/ITexturesPainter";

@injectable()
export class TexturePainter implements ITexturePainter {
    private _texturesConfigKey: string = "materials";
    @inject(TYPES.ICacheManager) _cache: ICacheManager;
    @inject(TYPES.IConfigProvider) _config: IConfigProvider;
    @inject(TYPES.ISceneBuilder) _sceneProvider: ISceneBuilder;

    paint(): void {
        throw new Error("Method not implemented.");
    }

    private _getTexture(name: string): BABYLON.StandardMaterial {
        return this._getTextureFromCache(name) || this._getTextureFromConfig(name);
    }

    private _getTextureFromCache(name: string): BABYLON.StandardMaterial {
        return <BABYLON.StandardMaterial>this._cache.retrieve(this._getTextureKey(name));
    }

    private _getTextureFromConfig(name: string): BABYLON.StandardMaterial {
        var texture: BABYLON.StandardMaterial;
        var textureConfig: any = (<Array<any>>this._config.getSetting(this._texturesConfigKey)).find(material => material.name === name);
        if (textureConfig) {
            texture = new BABYLON.StandardMaterial(name, this._sceneProvider.scene);

            // TODO: build texture

            this._cache.store(this._getTextureKey(name), texture);
        }
        return texture;
    }

    private _getTextureKey(name: string) {
        return BABYLON.StandardMaterial.name + "." + name;
    }
}