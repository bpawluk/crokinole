import { inject, injectable } from "inversify";
import { TYPES } from "./di/types";
import { ISceneBuilder } from "./mechanics/ISceneBuilder";
import { IPhysicsProvider } from "./mechanics/IPhysicsProvider";

@injectable()
export class Game implements Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    @inject(TYPES.ISceneBuilder) private _sceneBuilder: ISceneBuilder;
    @inject(TYPES.IPhysicsProvider) private _physicsProvider: IPhysicsProvider;

    constructor(@inject(TYPES.canvas_name) canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    start(): void {
        this._sceneBuilder.buildScene(this._canvas, this._engine);
        this._sceneBuilder.sceneBuiltEvent.subscribe((scene) => {
            this._scene = scene;
            this._physicsProvider.enablePhysics(this._scene, false);
            //TODO: Remove
            this._scene.actionManager = new BABYLON.ActionManager(this._scene);
            this._scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnKeyDownTrigger, parameter: 'd' }, () => this._setupDiscTest()));
            this._doRender();
        });
    }

    //TODO: Remove
    private _setupDiscTest(): void {
        var discMat = new BABYLON.StandardMaterial("discMat", this._scene);
        discMat.diffuseColor = new BABYLON.Color3(.2, .2, 1);

        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 32 }, this._scene);
        disc.material = discMat;

        disc.position.y = .385
        disc.position.x = 3.19

        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.6, friction: 0.005 }, this._scene);
        disc.physicsImpostor.applyImpulse(new BABYLON.Vector3(-3, 0, 0), disc.getAbsolutePosition())
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