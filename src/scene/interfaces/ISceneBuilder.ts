import { ISimpleEvent } from "strongly-typed-events";

export interface ISceneBuilder {
    readonly scene: BABYLON.Scene;
    readonly onSceneBuilt: ISimpleEvent<BABYLON.Scene>;
    buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): Promise<void>;
}