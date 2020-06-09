import { Pawn } from "../model/Pawn";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";

export interface IPawnProvider {
    init(scene: BABYLON.Scene): void;
    createPawn(color: string): Pawn;
}