import { ISimpleEvent } from "strongly-typed-events";

export interface ISceneBuilder {
    readonly sceneBuiltEvent: ISimpleEvent<BABYLON.Scene>;
    buildScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine): void;
}