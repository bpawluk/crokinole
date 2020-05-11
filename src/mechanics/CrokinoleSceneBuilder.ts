import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";
import { ISceneBuilder } from "./ISceneBuilder";
import { ILightsProvider } from "./ILightsProvider";
import { ICameraManager } from "../services/ICameraManager";

@injectable()
export class CrokinoleSceneBuilder implements ISceneBuilder {
    private _canvas: HTMLCanvasElement;
    private _scene: BABYLON.Scene;
    private _sceneBuiltDispatcher: SimpleEventDispatcher<BABYLON.Scene>;

    @inject(TYPES.ILightsProvider) private _lightsProvider: ILightsProvider;
    @inject(TYPES.ICameraManager) private _cameraManager: ICameraManager;

    constructor() {
        this._sceneBuiltDispatcher = new SimpleEventDispatcher<BABYLON.Scene>();
    }

    get sceneBuiltEvent(): ISimpleEvent<BABYLON.Scene> {
        return this._sceneBuiltDispatcher.asEvent();
    }

    buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): void {
        this._canvas = canvas;
        BABYLON.SceneLoader.Load("", "crokinole.babylon", engine, (scene) => scene.executeWhenReady(() => this._onSceneReady(scene)));
    }

    private _onSceneReady(scene: BABYLON.Scene): void {
        this._scene = scene;
        this._lightsProvider.provideLights(this._scene);
        this._cameraManager.setupCamera(this._canvas, this._scene);
        this._sceneBuiltDispatcher.dispatch(this._scene);
    }
}