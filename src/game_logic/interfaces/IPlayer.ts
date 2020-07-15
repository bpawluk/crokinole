import { Pawn } from "../../model/Pawn";

export interface IPlayer {
    readonly color: string;
    move(): Promise<Pawn>;
}