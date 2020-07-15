import { IPlayer } from "../game_logic/interfaces/IPlayer";
import { Pawn } from "./Pawn";
import { Score } from "./Score";
import { inject } from "inversify";
import { TYPES } from "../di/types";
import { IPawnPositionHelper } from "../game_logic/interfaces/IPawnPositionHelper";

export class GameState {
    private _SHOTS_PER_ROUND: number = 12;

    private _players: Array<IPlayer>;
    private _pawns: Map<IPlayer, Array<Pawn>>;
    private _scores: Map<IPlayer, Score>;
    private _nextPlayerIndex: number;

    private _pawnPositionHelper: IPawnPositionHelper;

    constructor(players: Array<IPlayer>, pawnPositionHelper: IPawnPositionHelper) {
        this._players = players;
        this._nextPlayerIndex = 0;
        this._pawns = new Map<IPlayer, Array<Pawn>>();
        this._scores = new Map<IPlayer, Score>();
        this._players.forEach(player => {
            this._pawns.set(player, []);
            this._scores.set(player, new Score(this._SHOTS_PER_ROUND));
        });
        this._pawnPositionHelper = pawnPositionHelper;
    }

    getPlayers(): Array<IPlayer> {
        return this._players;
    }

    getPawns(): Array<Pawn> {
        var pawns: Array<Pawn> = [];
        this._players.forEach(player => pawns = pawns.concat(this._pawns.get(player)));
        return pawns;
    }

    getScores(): Map<IPlayer, Score> {
        return this._scores;
    }

    nextPlayer(): IPlayer {
        return this._players[this._nextPlayerIndex];
    }

    isFreeShot(): boolean {
        return this._pawns.get(this._getOtherPlayer(this.nextPlayer())).filter(pawn => pawn.isInPlay).length == 0;
    }

    playerMoved(pawn: Pawn): void {
        this._pawns.get(this._players[this._nextPlayerIndex]).push(pawn);
        this._nextPlayerIndex = this._nextPlayerIndex + 1 >= this._players.length ? 0 : this._nextPlayerIndex + 1;
    }

    calculatePoints(): void {
        this._players.forEach(player => {
            var score = this._scores.get(player);
            score.points = 0;
            this._pawns.get(player).forEach(pawn => {
                if(pawn.isIn20Bowl) {
                    score.points += 20;
                } else if(pawn.isInPlay) {
                    score.points += this._pawnPositionHelper.getPoints(pawn.getMesh().position);
                }
            });
            score.movesLeft = this._SHOTS_PER_ROUND - this._pawns.get(player).length;
        });
    }

    newRound() {
        this.disposeAll();
        var winner = this.getRoundWinner();
        if(winner != null) {
            var score = this._scores.get(winner);
            score.score += score.points - this._scores.get(this._getOtherPlayer(winner)).points;
        }
        this._players.forEach(player => {
            this._pawns.set(player, []);
            var score = this._scores.get(player);
            score.points = 0;
            score.movesLeft = this._SHOTS_PER_ROUND - this._pawns.get(player).length;
        });
    }

    isRoundFinished(): boolean {
        return this._players.every(player => this._pawns.get(player).length >= this._SHOTS_PER_ROUND);
    }

    getRoundWinner(): IPlayer {
        if (this.isRoundFinished()) {
            var firstPlayer = this._players[0];
            var firstScore = this._scores.get(firstPlayer);
            var secondPlayer = this._players[1];
            var secondScore = this._scores.get(secondPlayer);

            if (firstScore.points === secondScore.points) return null;

            return firstScore.points > secondScore.points ? firstPlayer : secondPlayer;
        } else {
            return null;
        }
    }

    isGameFinished(): boolean {
        return this._players.find(player => this._scores.get(player).score >= 100) != null;
    }

    getGameWinner(): IPlayer {
        if (this.isGameFinished()) {
            var firstPlayer = this._players[0];
            var firstScore = this._scores.get(firstPlayer);
            var secondPlayer = this._players[1];
            var secondScore = this._scores.get(secondPlayer);

            if (firstScore.score === secondScore.score) return null;

            return firstScore.score > secondScore.score ? firstPlayer : secondPlayer;
        } else {
            return null;
        }
    }

    disposeAll(): void {
        this._players.forEach(player => this._pawns.get(player).forEach(pawn => {
            if (!pawn.getMesh().isDisposed()) {
                pawn.disposePawn();
            }
        }))
    }

    private _getOtherPlayer(notTheOne: IPlayer): IPlayer {
        return this._players.find(player => player != notTheOne);
    }
}