import { Pawn } from "../model/Pawn";

export interface IPawnProvider {
    createPawn(color: string): Pawn;
}