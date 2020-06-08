import { inject, injectable } from "inversify";
import { TYPES } from "./di/types";
import { ISceneBuilder } from "./mechanics/ISceneBuilder";
import { IPhysicsProvider } from "./mechanics/IPhysicsProvider";
import { IGameController } from "./game_logic/IGameController";
import { IGuiProvider } from "./gui/IGuiProvider";
import { IMakingMoveGui } from "./gui/IMakingMoveGui";
import { IMenuGui } from "./gui/IMenuGui";

@injectable()
export class Game implements Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;

    @inject(TYPES.ISceneBuilder) private _sceneBuilder: ISceneBuilder;
    @inject(TYPES.IPhysicsProvider) private _physicsProvider: IPhysicsProvider;
    @inject(TYPES.IGameController) private _gameController: IGameController;
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;
    @inject(TYPES.IMakingMoveGui) private _makingMoveGui: IMakingMoveGui;
    @inject(TYPES.IMenuGui) private _menuGui: IMenuGui;

    constructor(@inject(TYPES.canvas_name) canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    async start(): Promise<void> {
        await this._sceneBuilder.buildScene(this._canvas, this._engine);
        this._scene = this._sceneBuilder.scene;
        this._physicsProvider.enablePhysics(this._scene, false);
        this._guiProvider.init(this._scene);
        this._makingMoveGui.init(this._scene);
        this._doRender();
        this._menuGui.showMainMenu(() => this._gameController.startGame());
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