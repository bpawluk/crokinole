import { injectable } from "inversify";
import { ICameraManager } from "./ICameraManager";

@injectable()
export class CameraManager implements ICameraManager {
    setupCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene): void {
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 5, 10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas);
    }
}