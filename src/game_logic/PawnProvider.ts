import { IPawnProvider } from "./IPawnProvider";
import { injectable } from "inversify";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { Pawn } from "../model/Pawn";

@injectable()
export class PawnProvider implements IPawnProvider {
    private _scene: BABYLON.Scene;

    private _frictionCoef: number = 0.02; 
    private _materials: Map<string, BABYLON.Material>;

    init(scene: BABYLON.Scene): void {
        this._scene = scene;
        this._materials = new Map();
        this._materials.set("Cyan", this._scene.getMaterialByID("Cyan"));
        this._materials.set("Purple", this._scene.getMaterialByID("Purple"));
    }
    
    createPawn(color: string): Pawn {
        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 20 }, this._scene);
        disc.position.y = .385;
        disc.position.x = 3.19;
        disc.material = this._materials.get(color);
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.75, friction: 0 }, this._scene);
        disc.physicsImpostor.registerAfterPhysicsStep(impostor => {
            var currentVelocity = impostor.getLinearVelocity();
            var currentAngularVelocity = impostor.getAngularVelocity();
            impostor.setLinearVelocity(currentVelocity.multiplyByFloats(1 - this._frictionCoef, 1, 1 - this._frictionCoef));
            impostor.setAngularVelocity(currentAngularVelocity.multiplyByFloats(1 - this._frictionCoef, 1 - this._frictionCoef, 1 - this._frictionCoef))
        });
        return new Pawn(disc);
    }
}