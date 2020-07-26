import { inject, injectable } from "inversify";
import { IConfigProvider } from "../config/IConfigProvider";
import { TYPES } from "../di/types";
import { ICacheManager } from "../helpers/interfaces/ICacheManager";
import { IMaterialsProvider } from "./interfaces/IMaterialsProvider";

@injectable()
export class StandardMaterialsProvider implements IMaterialsProvider {
    private _materialsConfigKey: string = "materials";
    private _lightingTypes: Array<string> = ["diffuse", "specular", "emissive", "ambient"];
    private _scene: BABYLON.Scene;

    @inject(TYPES.ICacheManager) private _cache: ICacheManager;
    @inject(TYPES.IConfigProvider) private _config: IConfigProvider;

    getMaterial(name: string): BABYLON.Material {
        return this._getMaterialFromCache(name) || this._getMaterialFromConfig(name);
    }

    private _getMaterialFromCache(name: string): BABYLON.StandardMaterial {
        return <BABYLON.StandardMaterial>this._cache.retrieve(this._getMaterialKey(name));
    }

    private _getMaterialFromConfig(name: string): BABYLON.StandardMaterial {
        var material: BABYLON.StandardMaterial;
        var materialConfig: any = (<Array<any>>this._config.getSetting(this._materialsConfigKey)).find(material => material.name === name);
        if (materialConfig) {
            material = new BABYLON.StandardMaterial(name, this._scene);
            this._setMaterialLighting(material, materialConfig);
            this._cache.store(this._getMaterialKey(name), material);
        }
        return material;
    }

    private _getMaterialKey(name: string) {
        return BABYLON.StandardMaterial.name + "." + name;
    }

    private _setMaterialLighting(material: BABYLON.StandardMaterial, config: any) {
        this._lightingTypes.forEach(type => {
            if (config.hasOwnProperty(type)) {
                var color = config[type].color;
                if (Array.isArray(color) && color.length === 3) {
                    material[type + "Color"] = new BABYLON.Color3(color[0], color[1], color[2]);
                }
                if (config[type].texture) {
                    material[type + "Texture"] = new BABYLON.Texture(config[type].texture, this._scene);
                    material[type + "Texture"].uScale = config[type].uScale;
                    material[type + "Texture"].vScale = config[type].vScale;
                }
            }
        });
        if (config.hasOwnProperty("backFaceCulling")) {
            material.backFaceCulling = config.backFaceCulling;
        }
    }
}