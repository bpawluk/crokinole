import { injectable } from "inversify";
import { ILightsProvider } from "./interfaces/ILightsProvider";

@injectable()
export class CrokinoleLightsProvider implements ILightsProvider {
    provideLights(scene: BABYLON.Scene): void {
        new BABYLON.DirectionalLight("light", new BABYLON.Vector3(1, -1, -1), scene);
    }
}