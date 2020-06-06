import { IPawnProvider } from "./IPawnProvider";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { Pawn } from "../model/Pawn";

@injectable()
export class PawnProvider implements IPawnProvider {
    @inject(TYPES.ISceneBuilder) private _sceneProvider: ISceneBuilder;

    private _frictionCoef: number = 0.02; 
    
    createPawn(color: string): Pawn {
        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 24 }, this._sceneProvider.scene);
        disc.position.y = .385;
        disc.position.x = 3.19;
        disc.material = this._sceneProvider.scene.getMaterialByID("Material.002");
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.75, friction: 0 }, this._sceneProvider.scene);
        disc.physicsImpostor.registerAfterPhysicsStep(impostor => {
            var currentVelocity = impostor.getLinearVelocity();
            impostor.setLinearVelocity(currentVelocity.multiplyByFloats(1 - this._frictionCoef, 1, 1 - this._frictionCoef));
        });
        return new Pawn(disc);
    }
}