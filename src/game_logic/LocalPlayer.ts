import { Pawn } from "../model/Pawn";
import { IPlayer } from "./IPlayer";
import { ICameraManager } from "../services/ICameraManager";
import { IMakingMoveGui } from "../gui/IMakingMoveGui";
import { IPawnProvider } from "./IPawnProvider";

export class LocalPlayer implements IPlayer {
    private _cameraManager: ICameraManager;
    private _makingMoveGui: IMakingMoveGui;
    private _pawnProvider: IPawnProvider;

    private _movingDiscRotationCentre: BABYLON.Vector3;
    private _movingDiscRotationAxis: BABYLON.Vector3;
    private _movingDiscRotationRadians: number;

    private _color: string;
    get color() {
        return this._color;
    }

    constructor(color: string, cameraManager: ICameraManager, makingMoveGui: IMakingMoveGui, pawnProvider: IPawnProvider) {
        this._color = color;
        this._cameraManager = cameraManager;
        this._makingMoveGui = makingMoveGui;
        this._pawnProvider = pawnProvider;

        this._movingDiscRotationCentre = BABYLON.Vector3.Zero();
        this._movingDiscRotationAxis = new BABYLON.Vector3(0, 1, 0);
        this._movingDiscRotationRadians = .01;
    }

    async move(): Promise<Pawn> {
        var pawn = this._pawnProvider.createPawn(this._color);

        await this._choosePosition(pawn.getMesh());
        var contactPoint = await this._chooseContactPoint(pawn.getMesh());
        var direction = await this._chooseDirection(pawn.getMesh());
        var force = await this._chooseForce();

        pawn.makeMove(contactPoint, direction, force);
        this._cameraManager.resetCamera();

        return pawn;
    }

    private async _choosePosition(disc: BABYLON.Mesh): Promise<void> {
        this._followDiscWithCamera(disc);
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
        this._cameraManager.moveCamera(new BABYLON.Vector3(0, 10, 0));
        var direction = BABYLON.Vector3.ZeroReadOnly.subtract(disc.position).normalize();
        var setDirection = (newDirection: BABYLON.Vector3) => direction = newDirection;
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChooseDirectionGui(disc, direction, setDirection, () => resolve());
        });
        return direction;
    }

    private async _chooseForce(): Promise<number> {
        var forceFactor = 1;
        var maxForce = 4;
        var setForce = (newFactor: number) => forceFactor = newFactor;
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChooseForceGui(setForce, () => resolve());
        });
        return forceFactor * maxForce;
    }

    private _followDiscWithCamera(disc: BABYLON.Mesh) {
        this._cameraManager.moveCamera(disc.position.add(disc.position.subtract(this._movingDiscRotationCentre).normalize().multiplyByFloats(2, 2, 2)));
    }
}