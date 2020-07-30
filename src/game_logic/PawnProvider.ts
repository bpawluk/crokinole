import { IPawnProvider } from "./interfaces/IPawnProvider";
import { injectable, inject } from "inversify";
import { Pawn } from "../model/Pawn";
import { TYPES } from "../di/types";
import { IPawnPositionHelper } from "./interfaces/IPawnPositionHelper";
import { ISceneBuilder } from "../scene/interfaces/ISceneBuilder";
import { SceneInitialable } from "../utils/SceneInitialable";
import { IMaterialsProvider } from "../scene/interfaces/IMaterialsProvider";
import { IConfigProvider } from "../config/IConfigProvider";

@injectable()
export class PawnProvider extends SceneInitialable implements IPawnProvider {
    private _configKey: string = "players";
    private _scene: BABYLON.Scene;
    private _frictionCoef: number = 0.02;

    @inject(TYPES.IPawnPositionHelper) _pawnPositionHelper: IPawnPositionHelper;
    @inject(TYPES.IConfigProvider) _config: IConfigProvider;
    @inject(TYPES.IMaterialsProvider) _materialsProvider: IMaterialsProvider;

    constructor(@inject(TYPES.ISceneBuilder) sceneBuilder: ISceneBuilder) {
        super(sceneBuilder);
    }

    createPawn(color: string): Pawn {
        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .12, diameter: 0.32, tessellation: 20 }, this._scene);
        disc.position = this._pawnPositionHelper.getStartingPosition(color);
        disc.material = this._getMaterial(color);
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.75, friction: 0 }, this._scene);
        disc.physicsImpostor.registerAfterPhysicsStep(impostor => {
            var currentVelocity = impostor.getLinearVelocity();
            var currentAngularVelocity = impostor.getAngularVelocity();
            impostor.setLinearVelocity(currentVelocity.multiplyByFloats(1 - this._frictionCoef, 1, 1 - this._frictionCoef));
            impostor.setAngularVelocity(currentAngularVelocity.multiplyByFloats(1 - this._frictionCoef, 1 - this._frictionCoef, 1 - this._frictionCoef))
        });
        return new Pawn(disc, color, this._pawnPositionHelper);
    }

    private _getMaterial(color: string): BABYLON.Material {
        var material: BABYLON.Material;
        var players = <Array<any>>this._config.getSetting(this._configKey);

        if (Array.isArray(players)) {
            var player = players.find(player => player.color === color);
            if (player && player.material) {
                material = this._materialsProvider.getMaterial(player.material);
            }
        }

        if (!material) {
            material = new BABYLON.StandardMaterial("blank", this._scene);
        }

        return material;
    }

    protected _init(scene: BABYLON.Scene): void {
        super._init(scene);
        this._scene = scene;
    }
}