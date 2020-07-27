import { IPawnProvider } from "./interfaces/IPawnProvider";
import { injectable, inject } from "inversify";
import { Pawn } from "../model/Pawn";
import { TYPES } from "../di/types";
import { IPawnPositionHelper } from "./interfaces/IPawnPositionHelper";

@injectable()
export class PawnProvider implements IPawnProvider {
    private _scene: BABYLON.Scene;

    private _frictionCoef: number = 0.02; 
    private _materials: Map<string, BABYLON.Material>;

    @inject(TYPES.IPawnPositionHelper) _pawnPositionHelper: IPawnPositionHelper;

    init(scene: BABYLON.Scene): void {
        this._scene = scene;
        this._materials = new Map();
        this._materials.set("Cyan", new BABYLON.StandardMaterial("a", this._scene));
        this._materials.set("Purple", new BABYLON.StandardMaterial("b", this._scene));
    }
    
    createPawn(color: string): Pawn {
        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .12, diameter: 0.32, tessellation: 20 }, this._scene);
        disc.position = this._pawnPositionHelper.getStartingPosition(color);
        disc.material = this._materials.get(color); // TODO: Use config
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.75, friction: 0 }, this._scene);
        disc.physicsImpostor.registerAfterPhysicsStep(impostor => {
            var currentVelocity = impostor.getLinearVelocity();
            var currentAngularVelocity = impostor.getAngularVelocity();
            impostor.setLinearVelocity(currentVelocity.multiplyByFloats(1 - this._frictionCoef, 1, 1 - this._frictionCoef));
            impostor.setAngularVelocity(currentAngularVelocity.multiplyByFloats(1 - this._frictionCoef, 1 - this._frictionCoef, 1 - this._frictionCoef))
        });
        return new Pawn(disc, color, this._pawnPositionHelper);
    }
}