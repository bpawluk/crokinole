import { IPlayer } from "./IPlayer";
import { IUserInput } from "../services/IUserInput";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { ICameraManager } from "../services/ICameraManager";
import { IMakingMoveGui } from "../gui/IMakingMoveGui";
import { IVectorMathHelper } from "../services/IVectorMathHelper";

export class LocalPlayer implements IPlayer {
    // TODO: Remove 
    private _sceneProvider: ISceneBuilder;

    private _cameraManager: ICameraManager;
    private _userInput: IUserInput;
    private _makingMoveGui: IMakingMoveGui;

    private _movingDiscRotationCentre: BABYLON.Vector3;
    private _movingDiscRotationAxis: BABYLON.Vector3;
    private _movingDiscRotationRadians: number;

    private _choosingDirectionDefaultDirection: BABYLON.Vector3;

    private _color: string;
    get color() {
        return this._color;
    }

    constructor(color: string, sceneProvider: ISceneBuilder, cameraManager: ICameraManager, userInput: IUserInput, makingMoveGui: IMakingMoveGui) {
        this._color = color;
        this._sceneProvider = sceneProvider;
        this._cameraManager = cameraManager;
        this._userInput = userInput;
        this._makingMoveGui = makingMoveGui;

        this._movingDiscRotationCentre = BABYLON.Vector3.Zero();
        this._movingDiscRotationAxis = new BABYLON.Vector3(0, 1, 0);
        this._movingDiscRotationRadians = .01;

        this._choosingDirectionDefaultDirection = new BABYLON.Vector3(1, 0, 1);
    }

    async move(): Promise<void> {
        await new Promise<void>((resolve) => {
            this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
                resolve();
            });
        });

        var disc = this._createDisc();

        await this._choosePosition(disc);
        var contactPoint = await this._chooseContactPoint(disc);
        var direction = await this._chooseDirection(disc);
        var force = await this._chooseForce();

        disc.physicsImpostor.applyImpulse(direction.multiplyByFloats(force, 0, force), contactPoint);
        this._cameraManager.resetCamera();
    }

    private async _choosePosition(disc: BABYLON.Mesh): Promise<void> {
        var moveLeft = () => this._moveDiscByRadians(disc, this._movingDiscRotationRadians);
        var moveRight = () => this._moveDiscByRadians(disc, -this._movingDiscRotationRadians);
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChoosePositionGui(moveLeft, moveRight, () => resolve());
        });
    }

    private _moveDiscByRadians(disc: BABYLON.Mesh, radians: number): void {
        disc.rotateAround(this._movingDiscRotationCentre, this._movingDiscRotationAxis, radians);
        this._followDiscWithCamera(disc);
    }

    private async _chooseContactPoint(disc: BABYLON.Mesh): Promise<BABYLON.Vector3> {
        var point = disc.position;
        var setContactPoint = (newPoint: BABYLON.Vector3) => point = newPoint;
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChooseContactPointGui(disc, setContactPoint, () => resolve());
        });
        return point;
    } 

    private async _chooseDirection(disc: BABYLON.Mesh): Promise<BABYLON.Vector3> {
        this._cameraManager.moveCamera(new BABYLON.Vector3(0,10,0));
        var direction = BABYLON.Vector3.ZeroReadOnly.subtract(disc.position).normalize();
        var setDirection = (newDirection: BABYLON.Vector3) => direction = newDirection;
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChooseDirectionGui(disc, direction, setDirection, () => resolve());
        });
        return direction;
    }

    private async _chooseForce(): Promise<number> {
        var forceFactor = 1;
        var maxForce = 3;
        var setForce = (newForce: number) => forceFactor = newForce;
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChooseForceGui(setForce, () => resolve());
        });
        return forceFactor * maxForce;
    }

    private _createDisc(): BABYLON.Mesh {
        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 32 }, this._sceneProvider.scene);
        disc.position.y = .385
        disc.position.x = 3.19
        disc.material = this._sceneProvider.scene.getMaterialByID("Material.002");
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.6, friction: 0.005 }, this._sceneProvider.scene);
        this._followDiscWithCamera(disc);
        return disc;
    }

    private _followDiscWithCamera(disc: BABYLON.Mesh) {
        this._cameraManager.moveCamera(disc.position.add(disc.position.subtract(this._movingDiscRotationCentre).normalize().multiplyByFloats(2, 2, 2)));
    }
}