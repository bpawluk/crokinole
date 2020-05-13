import { IPlayer } from "../game_logic/IPlayer";

export class GameState {
    private _players: Array<IPlayer>;
    private _nextPlayerIndex: number;

    constructor(players: Array<IPlayer>) {
        this._players = players;
        this._nextPlayerIndex = 0;
    }
    
    nextPlayer(): IPlayer {
        return this._players[this._nextPlayerIndex];
    }

    isFinished(): boolean {
        return false;
    }
}