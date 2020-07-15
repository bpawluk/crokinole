export interface ISceneBuilder {
    buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): Promise<void>;
    readonly scene: BABYLON.Scene;
}