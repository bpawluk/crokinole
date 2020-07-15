import { injectable } from "inversify";
import { ICameraManager } from "./interfaces/ICameraManager";

@injectable()
export class CrokinoleCameraManager implements ICameraManager {
    private _camera: BABYLON.ArcRotateCamera;
    private _defaultPosition: BABYLON.Vector3;
    private _defaultTarget: BABYLON.Vector3;

    constructor() {
        this._defaultPosition = new BABYLON.Vector3(0, 5, 10);
        this._defaultTarget = new BABYLON.Vector3(0, .385, 0);
    }

    setupCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene): void {
        if (!this._camera) {
            this._camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, this._defaultPosition, scene);
            this._camera.setTarget(this._defaultTarget);
        }
    }

    moveCamera(to: BABYLON.Vector3): void {
        this._camera.setPosition(to);
    }

    resetCamera(): void {
        this._camera.position = this._defaultPosition;
        this._camera.setTarget(this._defaultTarget);
    }
}