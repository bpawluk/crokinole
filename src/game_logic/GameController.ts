import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IGameController } from "./IGameController";
import { IPlayerFactory } from "./IPlayerFactory";
import { GameState } from "../model/GameState";
import { IMenuGui } from "../gui/IMenuGui";
import { IGameStateGui } from "../gui/IGameStateGui";
import { Score } from "../model/Score";

@injectable()
export class GameController implements IGameController {
    private _gameState: GameState;

    @inject(TYPES.IMenuGui) _menuGui: IMenuGui;
    @inject(TYPES.IGameStateGui) _gameGui: IGameStateGui;
    @inject(TYPES.IPlayerFactory) _playerFactory: IPlayerFactory

    async startGame(): Promise<void> {
        this._initGame();
        this._gameGui.showGameState();

        while (true) {
            await this._updateGui();

            if (this._gameState.isGameFinished()) break;

            var newPawn = await this._gameState.nextPlayer().move();
            this._gameState.playerMoved(newPawn);

            await this._whenAllStopped();
            this._gameState.calculatePoints();
        }
        this._gameGui.hideGameState();
        this._gameGui.clear();
        this._gameState.disposeAll();
        this._menuGui.showGameEnded(() => this._newGame(), () => this._backToMenu(), this._gameState.getGameWinner().color);
    }

    private _initGame(): void {
        var whitePlayer = this._playerFactory.provideLocalPlayer("Cyan");
        var blackPlayer = this._playerFactory.provideLocalPlayer("Purple");
        this._gameState = new GameState([whitePlayer, blackPlayer]);
    }

    private async _updateGui(): Promise<void> {
        this._gameGui.hideGameState();

        var players = this._gameState.getPlayers();
        var scores = this._gameState.getScores();
        var firstPlayer = players[0];
        var firstScore = scores.get(firstPlayer);
        var secondPlayer = players[1];
        var secondScore = scores.get(secondPlayer);

        if (this._gameState.isRoundFinished()) {
            var winner = this._gameState.getRoundWinner() ? this._gameState.getRoundWinner().color : null;
            this._gameState.newRound();
            await new Promise<void>((resolve) => {
                this._menuGui.showRoundEnded(() => resolve(), winner, firstPlayer.color, firstScore.score, secondPlayer.color, secondScore.score);
            });
        } else {
            await new Promise<void>((resolve) => {
                this._menuGui.showNextTurn(() => resolve(), this._gameState.nextPlayer().color);
            });
        }

        this._gameGui.setScores(firstPlayer.color, firstScore, secondPlayer.color, secondScore);

        this._gameGui.showGameState();
    }

    private async _whenAllStopped(): Promise<void> {

    }

    private _newGame(): void {
        this._gameState.disposeAll();
        this.startGame();
    }

    private _backToMenu(): void {
        this._gameState.disposeAll();
        this._menuGui.showMainMenu(() => this.startGame());
    }
}