export class Pawn {
    private _mesh: BABYLON.Mesh;
    private _impostor: BABYLON.PhysicsImpostor;

    public constructor(mesh: BABYLON.Mesh) {
        this._mesh = mesh;
        this._impostor = mesh.physicsImpostor;
    }

    public getMesh(): BABYLON.Mesh {
        return this._mesh;
    }

    public makeMove(contactPoint: BABYLON.Vector3, direction: BABYLON.Vector3, force: number): void {
        this._impostor.applyImpulse(direction.multiplyByFloats(force, 0, force), contactPoint);
    }

    public async waitUntilStopped(): Promise<void> {

    }

    public disposePawn(): void {
        this._impostor = null;
        this._mesh.dispose();
    }
}