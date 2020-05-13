import { inject, injectable } from "inversify";
import { TYPES } from "./di/types";
import { ISceneBuilder } from "./mechanics/ISceneBuilder";
import { IPhysicsProvider } from "./mechanics/IPhysicsProvider";
import { IGameController } from "./game_logic/IGameController";

@injectable()
export class Game implements Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;

    @inject(TYPES.ISceneBuilder) private _sceneBuilder: ISceneBuilder;
    @inject(TYPES.IPhysicsProvider) private _physicsProvider: IPhysicsProvider;
    @inject(TYPES.IGameController) private _gameController: IGameController;

    constructor(@inject(TYPES.canvas_name) canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    async start(): Promise<void> {
        await this._sceneBuilder.buildScene(this._canvas, this._engine);
        this._scene = this._sceneBuilder.scene;
        this._physicsProvider.enablePhysics(this._scene, false);
        this._doRender();
        this._gameController.startGame();
    }

    private _doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}