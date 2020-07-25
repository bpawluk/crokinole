import { inject, injectable } from "inversify";
import { IConfigProvider } from "../config/IConfigProvider";
import { TYPES } from "../di/types";
import { ISkyboxBuilder } from "./interfaces/ISkyboxBuilder";

@injectable()
export class SkyboxBuilder implements ISkyboxBuilder {
    @inject(TYPES.IConfigProvider) private _config: IConfigProvider;

    createSkybox(scene: BABYLON.Scene): void {
        var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: this._config.getSetting("skybox.size") }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(this._config.getSetting("skybox.path"), scene, this._config.getSetting("skybox.extensions"));
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }
}