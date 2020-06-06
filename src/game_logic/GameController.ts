import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IGameController } from "./IGameController";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { IPlayerFactory } from "./IPlayerFactory";
import { GameState } from "../model/GameState";

@injectable()
export class GameController implements IGameController {
    private _gameState: GameState;
    private _playerFactory: IPlayerFactory;

    constructor(@inject(TYPES.IPlayerFactory) playerFactory: IPlayerFactory) {
        this._playerFactory = playerFactory;
        var whitePlayer = this._playerFactory.provideLocalPlayer("white");
        var blackPlayer = this._playerFactory.provideLocalPlayer("black");
        this._gameState = new GameState([whitePlayer, blackPlayer]);
    }

    async startGame(): Promise<void> {
        while (!this._gameState.isGameFinished()) {
            var next = this._gameState.nextPlayer();
            var newPawn = await next.move();
            this._gameState.playerMoved(newPawn);
            // await allStopped()
            this._gameState.calculatePoints();
            if(this._gameState.isRoundFinished) {
                // clear board
                // show round finished gui
            }
        }
        // show game ended gui
    }
}