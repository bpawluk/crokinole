import { ISimpleEvent } from "strongly-typed-events";
import { GameState } from "../model/GameState";

export interface IGameController {
    readonly gameEndedEvent: ISimpleEvent<GameState>;
    startGame(): Promise<void>;
}