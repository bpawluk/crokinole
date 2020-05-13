import { IPlayer } from "./IPlayer";
import { IUserInput } from "../services/IUserInput";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";

export class LocalPlayer implements IPlayer {
    // TODO: Remove 
    private _sceneProvider: ISceneBuilder;
    private _userInput: IUserInput;

    private _color: string;
    get color() {
        return this._color;
    }

    constructor(color: string, sceneProvider: ISceneBuilder, userInput: IUserInput) {
        this._color = color;
        this._sceneProvider = sceneProvider;
        this._userInput = userInput;
    }

    move(): Promise<void> {
        return new Promise<void>((resolve) => {
            this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
                var discMat = this._sceneProvider.scene.getMaterialByID("Material.002");

                var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 32 }, this._sceneProvider.scene);
                disc.material = discMat;

                disc.position.y = .385
                disc.position.x = 3.19

                disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.6, friction: 0.005 }, this._sceneProvider.scene);
                disc.physicsImpostor.applyImpulse(new BABYLON.Vector3(-3, 0, 0), disc.getAbsolutePosition())
                resolve();
            });
        });
    }
}