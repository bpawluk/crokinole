import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { ISceneBuilder } from "./interfaces/ISceneBuilder";
import { ILightsProvider } from "./interfaces/ILightsProvider";
import { ICameraManager } from "./interfaces/ICameraManager";

@injectable()
export class CrokinoleSceneBuilder implements ISceneBuilder {
    private _scene: BABYLON.Scene;

    @inject(TYPES.ILightsProvider) private _lightsProvider: ILightsProvider;
    @inject(TYPES.ICameraManager) private _cameraManager: ICameraManager;

    get scene(): BABYLON.Scene {
        if(!this._scene) {
            throw new Error("Scene is not built.");
        }
        return this._scene;
    }

    async buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): Promise<void> {
        return new Promise((resolve) => BABYLON.SceneLoader.Load("", "crokinole.babylon", engine, (scene) => scene.executeWhenReady(() => {
            this._scene = scene;
            this._applyTextures(this._scene);
            this._lightsProvider.provideLights(this._scene);
            this._cameraManager.setupCamera(canvas, this._scene);
            resolve(null);
        })));
    }

    private _applyTextures(scene: BABYLON.Scene): void {
        // TODO: implement and move to different class
    }
}