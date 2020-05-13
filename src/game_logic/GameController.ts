import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IGameController } from "./IGameController";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { IPlayer } from "./IPlayer";
import { IPlayerFactory } from "./IPlayerFactory";
import { GameState } from "../model/GameState";

@injectable()
export class GameController implements IGameController {
    private _gameState: GameState;
    private _whitePlayer: IPlayer;
    private _blackPlayer: IPlayer;
    private _playerFactory: IPlayerFactory;
    private _gameEndedDispatcher: SimpleEventDispatcher<GameState>;

    constructor(@inject(TYPES.IPlayerFactory) playerFactory: IPlayerFactory) {
        this._playerFactory = playerFactory;
        this._whitePlayer = this._playerFactory.provideLocalPlayer("white");
        this._blackPlayer = this._playerFactory.provideLocalPlayer("black");
        this._gameState = new GameState([this._whitePlayer, this._blackPlayer]);
        this._gameEndedDispatcher = new SimpleEventDispatcher<GameState>();
    }

    get gameEndedEvent(): ISimpleEvent<GameState> {
        return this._gameEndedDispatcher.asEvent();
    }

    async startGame(): Promise<void> {
        while (!this._gameState.isFinished()) {
            var next = this._gameState.nextPlayer();
            await next.move();
            console.log(next.color + " player made a move");
        }
    }
}