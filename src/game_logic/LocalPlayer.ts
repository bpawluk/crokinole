import { IPlayer } from "./IPlayer";
import { IUserInput } from "../services/IUserInput";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { ICameraManager } from "../services/ICameraManager";

export class LocalPlayer implements IPlayer {
    // TODO: Remove 
    private _sceneProvider: ISceneBuilder;
    private _cameraManager: ICameraManager;
    private _userInput: IUserInput;

    private _color: string;
    get color() {
        return this._color;
    }

    constructor(color: string, sceneProvider: ISceneBuilder, cameraManager: ICameraManager, userInput: IUserInput) {
        this._color = color;
        this._sceneProvider = sceneProvider;
        this._cameraManager = cameraManager;
        this._userInput = userInput;
    }

    async move(): Promise<void> {
        await new Promise<void>((resolve) => {
            this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
                resolve();
            });
        });

        var disc = this._createDisc();
        await this._choosePosition(disc);

        await new Promise<void>((resolve) => {
            this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
                //disc.physicsImpostor.applyImpulse(new BABYLON.Vector3(-3, 0, 0), disc.getAbsolutePosition())
                resolve();
            });
        });

        this._cameraManager.resetCamera();
    }

    private _choosePosition(disc: BABYLON.Mesh): Promise<void> {
        this._cameraManager.moveCamera(disc.position.add(disc.position.subtract(BABYLON.Vector3.Zero()).normalize().multiplyByFloats(2,2,2)));

        var pointerMoveCallback = (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
            if (pointerInfo.event instanceof PointerEvent) { }
        }

        this._userInput.registerPointerListener(BABYLON.PointerEventTypes.POINTERMOVE, pointerMoveCallback);

        return new Promise<void>((resolve) => {
            this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
                this._userInput.unregisterPointerListener(BABYLON.PointerEventTypes.POINTERMOVE, pointerMoveCallback);
                // TODO: Remove
                disc.physicsImpostor.applyImpulse(new BABYLON.Vector3(-3, 0, 0), disc.getAbsolutePosition());
                resolve();
            });
        });
    }

    private _createDisc(): BABYLON.Mesh {
        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 32 }, this._sceneProvider.scene);
        disc.position.y = .385
        disc.position.x = 3.19
        disc.material = this._sceneProvider.scene.getMaterialByID("Material.002");
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.6, friction: 0.005 }, this._sceneProvider.scene);
        return disc;
    }
}