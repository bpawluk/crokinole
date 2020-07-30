import { Pawn } from "../model/Pawn";
import { IPlayer } from "./interfaces/IPlayer";
import { ICameraManager } from "../scene/interfaces/ICameraManager";
import { IMakingMoveGui } from "../gui/interfaces/IMakingMoveGui";
import { IPawnProvider } from "./interfaces/IPawnProvider";

export class LocalPlayer implements IPlayer {
    private _cameraManager: ICameraManager;
    private _makingMoveGui: IMakingMoveGui;
    private _pawnProvider: IPawnProvider;

    private _movingDiscRotationCentre: BABYLON.Vector3;
    private _movingDiscRotationAxis: BABYLON.Vector3;

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
        var initialPosition = disc.position;
        var moveLeft = (step: number) => {
            var currentPosition = disc.position;
            if (this._normalize(Math.atan2(currentPosition.z, currentPosition.x) - Math.atan2(initialPosition.z, initialPosition.x)) > - Math.PI / 4) {
                this._moveDiscByRadians(disc, step)
            }
        };
        var moveRight = (step: number) => {
            var currentPosition = disc.position;
            if (this._normalize(Math.atan2(currentPosition.z, currentPosition.x) - Math.atan2(initialPosition.z, initialPosition.x)) < Math.PI / 4) {
                this._moveDiscByRadians(disc, -step);
            }
        };
        await new Promise<void>((resolve) => {
            this._makingMoveGui.showChoosePositionGui(moveLeft, moveRight, () => resolve());
        });
    }

    private _normalize(angle: number): number {
        if (angle > Math.PI) angle -= 2 * Math.PI;
        else if (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
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