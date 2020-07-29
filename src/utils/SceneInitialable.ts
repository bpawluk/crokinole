import { ISceneBuilder } from "../scene/interfaces/ISceneBuilder";
import { injectable } from "inversify";

@injectable()
export abstract class SceneInitialable {
    private _sceneBuilder: ISceneBuilder;
    private _onSceneBuilt = (scene: BABYLON.Scene) => this._init(scene);

    constructor(sceneBuilder: ISceneBuilder) {
        this._sceneBuilder = sceneBuilder;
        this._sceneBuilder.onSceneBuilt.subscribe(this._onSceneBuilt);
    }

    protected _init(scene: BABYLON.Scene): void {
        this._sceneBuilder.onSceneBuilt.unsubscribe(this._onSceneBuilt);
    };
}