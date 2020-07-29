import { inject, injectable } from "inversify";
import { TYPES } from "./di/types";
import { ISceneBuilder } from "./scene/interfaces/ISceneBuilder";
import { IPhysicsProvider } from "./scene/interfaces/IPhysicsProvider";
import { IGameController } from "./game_logic/interfaces/IGameController";
import { IMenuGui } from "./gui/interfaces/IMenuGui";
import { IConfigProvider } from "./config/IConfigProvider";

@injectable()
export class Game implements Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _fps: HTMLElement; // TODO: Remove and create a dedicated class displaying fps only on debug configuration
    
    @inject(TYPES.ILoadingScreen) private _loadingScreen: BABYLON.ILoadingScreen;
    @inject(TYPES.ISceneBuilder) private _sceneBuilder: ISceneBuilder;
    @inject(TYPES.IPhysicsProvider) private _physicsProvider: IPhysicsProvider;
    @inject(TYPES.IGameController) private _gameController: IGameController;
    @inject(TYPES.IConfigProvider) private _configProvider: IConfigProvider;
    @inject(TYPES.IMenuGui) private _menuGui: IMenuGui;

    constructor(@inject(TYPES.canvas_name) canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    async start(): Promise<void> {
        this._engine.loadingScreen = this._loadingScreen;
        this._loadingScreen.displayLoadingUI();

        this._fps = document.getElementById("fps"); // TODO: Remove

        await this._configProvider.init();

        await this._sceneBuilder.buildScene(this._canvas, this._engine);
        this._scene = this._sceneBuilder.scene;

        this._physicsProvider.enablePhysics(this._scene, false);

        this._doRender();
        
        this._menuGui.showMainMenu(() => this._gameController.startGame());
        this._loadingScreen.hideLoadingUI();
    }

    private _doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
            this._fps.innerHTML = this._engine.getFps().toFixed() + " fps"; // TODO: Remove
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}