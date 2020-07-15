import { injectable } from "inversify";
import { ILightsProvider } from "./interfaces/ILightsProvider";

@injectable()
export class CrokinoleLightsProvider implements ILightsProvider {
    provideLights(scene: BABYLON.Scene): void {
        new BABYLON.SpotLight("left", new BABYLON.Vector3(5, 5, 0), new BABYLON.Vector3(-1, -1, 0), Math.PI / 2, 1, scene);
        new BABYLON.SpotLight("right", new BABYLON.Vector3(-5, 5, 0), new BABYLON.Vector3(1, -1, 0), Math.PI / 2, 1, scene);
        new BABYLON.SpotLight("top", new BABYLON.Vector3(0, 5, 5), new BABYLON.Vector3(0, -1, -1), Math.PI / 2, 1, scene);
        new BABYLON.SpotLight("bottom", new BABYLON.Vector3(0, 5, -5), new BABYLON.Vector3(0, -1, 1), Math.PI / 2, 1, scene);
    }
}