import { IPlayer } from "./IPlayer";

export interface IPlayerFactory {
    provideLocalPlayer(color: string): IPlayer;
}