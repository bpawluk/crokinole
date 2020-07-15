import { IPawnPositionHelper } from "../game_logic/interfaces/IPawnPositionHelper";

export class Pawn {
    private _MIN_VELOCITY = 0.01;

    private _mesh: BABYLON.Mesh;
    private _impostor: BABYLON.PhysicsImpostor;

    isInPlay: boolean;
    isIn20Bowl: boolean;
    color: string;

    private _pawnPositionHelper: IPawnPositionHelper;

    public constructor(mesh: BABYLON.Mesh, playerColor: string, pawnPositionHelper: IPawnPositionHelper) {
        this._mesh = mesh;
        this._impostor = mesh.physicsImpostor;
        this.isInPlay = true;
        this.isIn20Bowl = false;
        this.color = playerColor;
        this._pawnPositionHelper = pawnPositionHelper;
    }

    public getMesh(): BABYLON.Mesh {
        return this._mesh;
    }

    public makeMove(contactPoint: BABYLON.Vector3, direction: BABYLON.Vector3, force: number): void {
        this._impostor.applyImpulse(direction.multiplyByFloats(force, 0, force), contactPoint);
    }

    public isStopped(): boolean {
        var velocity = this._impostor.getLinearVelocity();
        return this._pawnPositionHelper.isOutOfBands(this._mesh.position) || (Math.abs(velocity.x) <= this._MIN_VELOCITY && Math.abs(velocity.y) <= this._MIN_VELOCITY && Math.abs(velocity.z) <= this._MIN_VELOCITY);
    }

    public removeFrom20Hole() {
        this.isIn20Bowl = true;
        this.disposePawn();
    }

    public disposePawn(): void {
        this._impostor = null;
        this._mesh.dispose();
        this.isInPlay = false;
    }
}