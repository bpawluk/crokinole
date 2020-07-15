import { Pawn } from "../../model/Pawn";
import { ISceneBuilder } from "../../scene/interfaces/ISceneBuilder";

export interface IPawnProvider {
    init(scene: BABYLON.Scene): void;
    createPawn(color: string): Pawn;
}