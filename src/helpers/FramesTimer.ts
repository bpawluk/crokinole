import { IFramesTimer } from "./interfaces/IFramesTimer";
import { injectable, inject } from "inversify";
import { SceneInitialable } from "../utils/SceneInitialable";
import { TYPES } from "../di/types";
import { ISceneBuilder } from "../scene/interfaces/ISceneBuilder";

@injectable()
export class FramesTimer extends SceneInitialable implements IFramesTimer {
    private _scene: BABYLON.Scene;
    private _previousFrame: number;
    private _currentFrame: number;

    constructor(@inject(TYPES.ISceneBuilder) sceneBuilder: ISceneBuilder) {
        super(sceneBuilder);
    }

    timeSinceLastFrame(): number {
        return this._currentFrame - this._previousFrame || 0;
    }

    protected _init(scene: BABYLON.Scene): void {
        super._init(scene);
        this._scene = scene;
        this._scene.registerBeforeRender(() => {
            this._previousFrame = this._currentFrame;
            this._currentFrame = Date.now();
        });
    }
}