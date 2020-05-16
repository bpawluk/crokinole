import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { ISceneBuilder } from "./ISceneBuilder";
import { ILightsProvider } from "./ILightsProvider";
import { ICameraManager } from "../services/ICameraManager";

@injectable()
export class CrokinoleSceneBuilder implements ISceneBuilder {
    private _scene: BABYLON.Scene;

    @inject(TYPES.ILightsProvider) private _lightsProvider: ILightsProvider;
    @inject(TYPES.ICameraManager) private _cameraManager: ICameraManager;

    get scene(): BABYLON.Scene {
        if(!this._scene) {
            throw new Error("Scene is not built.");
        }
        this._scene.pointerX
        return this._scene;
    }

    async buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): Promise<void> {
        return new Promise((resolve) => BABYLON.SceneLoader.Load("", "crokinole.babylon", engine, (scene) => scene.executeWhenReady(() => {
            this._scene = scene;
            this._lightsProvider.provideLights(this._scene);
            this._cameraManager.setupCamera(canvas, this._scene);
            resolve(null);
        })));
    }
}