import { IFramesTimer } from "./interfaces/IFramesTimer";
import { injectable } from "inversify";

@injectable()
export class FramesTimer implements IFramesTimer {
    private _scene: BABYLON.Scene;
    private _previousFrame: number;
    private _currentFrame: number;

    init(scene: BABYLON.Scene): void {
        this._scene = scene;
        this._scene.registerBeforeRender(() => {
            this._previousFrame = this._currentFrame;
            this._currentFrame = Date.now();
        });
    }

    timeSinceLastFrame(): number {
        return this._currentFrame - this._previousFrame || 0;
    }
}