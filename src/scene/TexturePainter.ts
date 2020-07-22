import { inject, injectable } from "inversify";
import { IConfigProvider } from "../config/IConfigProvider";
import { TYPES } from "../di/types";
import { IMaterialsProvider } from "./interfaces/IMaterialsProvider";
import { ITexturePainter } from "./interfaces/ITexturesPainter";

@injectable()
export class TexturePainter implements ITexturePainter {
    private _configKey: string = "applyTextures";
    @inject(TYPES.IConfigProvider) private _config: IConfigProvider;
    @inject(TYPES.IMaterialsProvider) private _materialsProvider: IMaterialsProvider;

    paint(scene: BABYLON.Scene): void {
        var toPaint = <Array<any>>this._config.getSetting(this._configKey);
        if (Array.isArray(toPaint)) {
            toPaint.forEach(data => {
                var mesh = scene.getMeshByID(data.target);
                var material = this._materialsProvider.getMaterial(data.material);
                if (mesh && material) {
                    mesh.material = material;
                }
            })
        }
    }
}