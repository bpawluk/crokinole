import { IPlayer } from "../game_logic/IPlayer";
import { Pawn } from "./Pawn";

export class GameState {
    private _players: Array<IPlayer>;
    private _pawns: Map<IPlayer, Array<Pawn>>;
    private _nextPlayerIndex: number;

    constructor(players: Array<IPlayer>) {
        this._players = players;
        this._nextPlayerIndex = 0;
        this._pawns = new Map<IPlayer, Array<Pawn>>();
        this._players.forEach(player => this._pawns.set(player, []));
    }
    
    nextPlayer(): IPlayer {
        return this._players[this._nextPlayerIndex];
    }

    playerMoved(pawn: Pawn): void {
        this._pawns.get(this._players[this._nextPlayerIndex]).push(pawn);
        this._nextPlayerIndex = this._nextPlayerIndex + 1 >= this._players.length ? 0 : this._nextPlayerIndex + 1;
    }

    calculatePoints(): void {

    }

    isRoundFinished(): boolean {
        return false;
    }

    isGameFinished(): boolean {
        return false;
    }
}