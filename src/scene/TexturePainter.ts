import { inject, injectable } from "inversify";
import { IConfigProvider } from "../config/IConfigProvider";
import { TYPES } from "../di/types";
import { ICacheManager } from "../helpers/interfaces/ICacheManager";
import { ITexturePainter } from "./interfaces/ITexturesPainter";

@injectable()
export class TexturePainter implements ITexturePainter {
    private _texturesConfigKey: string = "materials";
    private _lightingTypes: Array<string> = ["diffuse", "specular", "emissive", "ambient"];
    private _scene: BABYLON.Scene;
    @inject(TYPES.ICacheManager) private _cache: ICacheManager;
    @inject(TYPES.IConfigProvider) private _config: IConfigProvider;

    paint(scene: BABYLON.Scene): void {
        this._scene = scene;
        // TODO: actually implement painting all meshes
        this._scene.getMeshByID("Bands").material = this._getTexture("bandsTxt");
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
            texture = new BABYLON.StandardMaterial(name, this._scene);
            this._setTextureLighting(texture, textureConfig);
            this._cache.store(this._getTextureKey(name), texture);
        }
        return texture;
    }

    private _getTextureKey(name: string) {
        return BABYLON.StandardMaterial.name + "." + name;
    }

    private _setTextureLighting(texture: BABYLON.StandardMaterial, config: any) {
        this._lightingTypes.forEach(type => {
            if (config.hasOwnProperty(type)) {
                var color = config[type].color;
                if (Array.isArray(color) && color.length === 3) {
                    texture[type + "Color"] = new BABYLON.Color3(color[0], color[1], color[2]);
                }
                if (config[type].texture) {
                    texture[type + "Texture"] = new BABYLON.Texture(config[type].texture, this._scene);
                }
            }
        })
    }
}