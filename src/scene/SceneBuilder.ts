import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { ISceneBuilder } from "./interfaces/ISceneBuilder";
import { ILightsProvider } from "./interfaces/ILightsProvider";
import { ICameraManager } from "./interfaces/ICameraManager";
import { ITexturePainter } from "./interfaces/ITexturesPainter";
import { ISkyboxBuilder } from "./interfaces/ISkyboxBuilder";
import { SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";

@injectable()
export class SceneBuilder implements ISceneBuilder {
    private _scene: BABYLON.Scene;
    private _onSceneBuilt: SimpleEventDispatcher<BABYLON.Scene>;

    @inject(TYPES.ILightsProvider) private _lightsProvider: ILightsProvider;
    @inject(TYPES.ICameraManager) private _cameraManager: ICameraManager;
    @inject(TYPES.ISkyboxBuilder) private _skyboxBuilder: ISkyboxBuilder;
    @inject(TYPES.ITexturePainter) private _texturePainter: ITexturePainter;

    constructor() {
        this._onSceneBuilt = new SimpleEventDispatcher<BABYLON.Scene>();
    }

    get scene(): BABYLON.Scene {
        if (!this._scene) {
            throw new Error("Scene is not built.");
        }
        return this._scene;
    }

    get onSceneBuilt(): ISimpleEvent<BABYLON.Scene> {
        return this._onSceneBuilt.asEvent();
    }

    async buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): Promise<void> {
        return new Promise((resolve) => BABYLON.SceneLoader.Load("", "crokinole.babylon", engine, (scene) => scene.executeWhenReady(() => {
            this._scene = scene;
            this._texturePainter.paint(this._scene);
            this._skyboxBuilder.createSkybox(this._scene);
            this._lightsProvider.provideLights(this._scene);
            this._cameraManager.setupCamera(canvas, this._scene);
            this._onSceneBuilt.dispatch(scene);
            resolve(null);
        })));
    }
}