import { inject, injectable } from "inversify";
import { TYPES } from "./di/types";
import { ISceneBuilder } from "./scene/interfaces/ISceneBuilder";
import { IPhysicsProvider } from "./scene/interfaces/IPhysicsProvider";
import { IGameController } from "./game_logic/interfaces/IGameController";
import { IGuiProvider } from "./gui/interfaces/IGuiProvider";
import { IMakingMoveGui } from "./gui/interfaces/IMakingMoveGui";
import { IMenuGui } from "./gui/interfaces/IMenuGui";
import { IPawnProvider } from "./game_logic/interfaces/IPawnProvider";
import { IConfigProvider } from "./config/IConfigProvider";

@injectable()
export class Game implements Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    
    @inject(TYPES.ILoadingScreen) private _loadingScreen: BABYLON.ILoadingScreen;
    @inject(TYPES.ISceneBuilder) private _sceneBuilder: ISceneBuilder;
    @inject(TYPES.IPhysicsProvider) private _physicsProvider: IPhysicsProvider;
    @inject(TYPES.IGameController) private _gameController: IGameController;
    @inject(TYPES.IPawnProvider) private _pawnProvider: IPawnProvider;
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;
    @inject(TYPES.IMakingMoveGui) private _makingMoveGui: IMakingMoveGui;
    @inject(TYPES.IConfigProvider) private _configProvider: IConfigProvider;
    @inject(TYPES.IMenuGui) private _menuGui: IMenuGui;

    constructor(@inject(TYPES.canvas_name) canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    async start(): Promise<void> {
        this._engine.loadingScreen = this._loadingScreen;
        this._loadingScreen.displayLoadingUI();

        await this._configProvider.init();

        await this._sceneBuilder.buildScene(this._canvas, this._engine);
        this._scene = this._sceneBuilder.scene;

        this._physicsProvider.enablePhysics(this._scene, false);

        await this._initServices();

        this._doRender();
        
        this._menuGui.showMainMenu(() => this._gameController.startGame());
        this._loadingScreen.hideLoadingUI();
    }

    private async _initServices(): Promise<void> {
        this._pawnProvider.init(this._scene);
        this._guiProvider.init(this._scene);
        this._makingMoveGui.init(this._scene);
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