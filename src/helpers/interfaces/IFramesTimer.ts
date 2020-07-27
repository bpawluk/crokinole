export interface IFramesTimer {
    init(scene: BABYLON.Scene): void;
    timeSinceLastFrame(): number;
}