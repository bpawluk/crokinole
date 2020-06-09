import { IMenuGui } from "./IMenuGui";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IGuiProvider } from "./IGuiProvider";

@injectable()
export class MenuGui implements IMenuGui {
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;

    // main menu gui
    private _mainMenuGui: BABYLON.GUI.Control;
    private _local: BABYLON.GUI.Button;

    // pause menu gui
    private _pauseGui: BABYLON.GUI.Control;

    // next turn gui
    private _nextTurnGui: BABYLON.GUI.Control;
    private _nextTurnLabel: BABYLON.GUI.TextBlock;
    private _makeMove: BABYLON.GUI.Button;

    // round ended gui
    private _roundEndedGui: BABYLON.GUI.Control;
    private _roundEndedLabel: BABYLON.GUI.TextBlock;
    private _firstPlayerLabel: BABYLON.GUI.TextBlock;
    private _firstPlayerScore: BABYLON.GUI.TextBlock;
    private _secondPlayerLabel: BABYLON.GUI.TextBlock;
    private _secondPlayerScore: BABYLON.GUI.TextBlock;
    private _nextRound: BABYLON.GUI.Button;

    // game ended gui
    private _gameEndedGui: BABYLON.GUI.Control;
    private _gameEndedLabel: BABYLON.GUI.TextBlock;
    private _newGame: BABYLON.GUI.Button;
    private _goToMenu: BABYLON.GUI.Button;

    public constructor() {
        this._constructMainMenuGui();
        this._constructPauseMenu();
        this._constructNextTurn();
        this._constructRoundEnded();
        this._constructGameEnded();
    }

    showMainMenu(startLocal: Function): void {
        this._guiProvider.attachControl(this._mainMenuGui);
        this._local.onPointerUpObservable.addOnce((data, state) => {
            this._guiProvider.detachControl(this._mainMenuGui);
            startLocal();
        });
    }

    showPauseMenu(resume: Function, goToMenu: Function): void {
        throw new Error("Method not implemented.");
    }

    showNextTurn(makeMove: Function, nextPlayer: string): void {
        this._nextTurnLabel.text = nextPlayer + " player's turn"
        this._guiProvider.attachControl(this._nextTurnGui);
        this._makeMove.onPointerUpObservable.addOnce((data, state) => {
            this._guiProvider.detachControl(this._nextTurnGui);
            makeMove();
        });
    }

    showRoundEnded(nextRound: Function, winner: string, firstPlayer: string, firstScore: number, secondPlayer: string, secondScore: number): void {
        var message = winner ? winner + " player won!" : "It's a draw!";
        this._roundEndedLabel.text = "Round ended - " + message;
        this._firstPlayerLabel.text = firstPlayer + " Player";
        this._firstPlayerScore.text = firstScore.toString();
        this._secondPlayerLabel.text = secondPlayer + " Player";
        this._secondPlayerScore.text = secondScore.toString();
        this._guiProvider.attachControl(this._roundEndedGui);
        this._nextRound.onPointerUpObservable.addOnce((data, state) => {
            this._guiProvider.detachControl(this._roundEndedGui);
            nextRound();
        });
    }

    showGameEnded(newGame: Function, goToMenu: Function, winner: string): void {
        this._gameEndedLabel.text = winner ? winner + " player won!" : "It's a draw!";
        this._guiProvider.attachControl(this._gameEndedGui);
        this._newGame.onPointerUpObservable.addOnce((data, state) => {
            this._guiProvider.detachControl(this._gameEndedGui);
            this._goToMenu.onPointerUpObservable.clear();

            newGame();
        });
        this._goToMenu.onPointerUpObservable.addOnce((data, state) => {
            this._guiProvider.detachControl(this._gameEndedGui);
            this._newGame.onPointerUpObservable.clear();
            goToMenu();
        });
    }

    private _constructMainMenuGui(): void {
        var panel = new BABYLON.GUI.Grid();
        panel.width = 1;
        panel.height = 1;
        panel.background = "#00000080";
        panel.addColumnDefinition(1);
        panel.addRowDefinition(0.25);
        panel.addRowDefinition(0.2);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.25);

        var title = new BABYLON.GUI.TextBlock();
        title.text = "Online Crokinole";
        title.color = "white"
        title.fontSize = 56;
        title.paddingBottom = "15%";
        panel.addControl(title, 1, 0);

        var online = BABYLON.GUI.Button.CreateSimpleButton("button", "Online Multiplayer");
        online.color = "white";
        online.background = "green";
        online.isEnabled = false;
        online.paddingBottom = "15%";
        online.paddingLeft = "30%";
        online.paddingRight = "30%";
        panel.addControl(online, 2, 0);

        this._local = BABYLON.GUI.Button.CreateSimpleButton("button", "Local Multiplayer");
        this._local.color = "white";
        this._local.background = "green";
        this._local.paddingBottom = "15%";
        this._local.paddingLeft = "30%";
        this._local.paddingRight = "30%";
        panel.addControl(this._local, 3, 0);

        var howToPlay = BABYLON.GUI.Button.CreateSimpleButton("button", "How to play");
        howToPlay.color = "white";
        howToPlay.background = "green";
        howToPlay.isEnabled = false;
        howToPlay.paddingBottom = "15%";
        howToPlay.paddingLeft = "30%";
        howToPlay.paddingRight = "30%";
        panel.addControl(howToPlay, 4, 0);

        this._mainMenuGui = panel;
    }

    private _constructPauseMenu(): void { }

    private _constructNextTurn(): void {
        var panel = new BABYLON.GUI.Grid();
        panel.width = 1;
        panel.height = 1;
        panel.addColumnDefinition(1);
        panel.addRowDefinition(0.25);
        panel.addRowDefinition(0.65);
        panel.addRowDefinition(0.10);

        this._nextTurnLabel = new BABYLON.GUI.TextBlock();
        this._nextTurnLabel.text = "<color> player's turn";
        this._nextTurnLabel.color = "white"
        this._nextTurnLabel.fontSize = 36;
        panel.addControl(this._nextTurnLabel, 0, 0);

        this._makeMove = BABYLON.GUI.Button.CreateSimpleButton("button", "Make Move");
        this._makeMove.color = "white";
        this._makeMove.background = "green";
        this._makeMove.paddingBottom = "20%";
        this._makeMove.paddingLeft = "30%";
        this._makeMove.paddingRight = "30%";
        this._makeMove.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        panel.addControl(this._makeMove, 2, 0);

        this._nextTurnGui = panel;
    }

    private _constructRoundEnded(): void { 
        var panel = new BABYLON.GUI.Grid();
        panel.width = 1;
        panel.height = 1;
        panel.background = "#00000080";
        panel.addColumnDefinition(1);
        panel.addRowDefinition(0.25);
        panel.addRowDefinition(0.15);
        panel.addRowDefinition(0.30);
        panel.addRowDefinition(0.20);
        panel.addRowDefinition(0.10);

        this._roundEndedLabel = new BABYLON.GUI.TextBlock();
        this._roundEndedLabel.text = "Round ended";
        this._roundEndedLabel.color = "white"
        this._roundEndedLabel.fontSize = 32;
        panel.addControl(this._roundEndedLabel, 0, 0);

        var scoreLabel = new BABYLON.GUI.TextBlock();
        scoreLabel.text = "SCORE";
        scoreLabel.color = "white"
        scoreLabel.fontSize = 32;
        scoreLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.addControl(scoreLabel, 1, 0);

        var scorePanel = new BABYLON.GUI.Grid();
        scorePanel.width = 1;
        scorePanel.height = 1;
        scorePanel.addColumnDefinition(0.4);
        scorePanel.addColumnDefinition(0.2);
        scorePanel.addColumnDefinition(0.4);
        scorePanel.addRowDefinition(0.5);
        scorePanel.addRowDefinition(0.5);

        this._firstPlayerLabel = new BABYLON.GUI.TextBlock();
        this._firstPlayerLabel.text = "Left Player";
        this._firstPlayerLabel.color = "white"
        this._firstPlayerLabel.fontSize = 24;
        scorePanel.addControl(this._firstPlayerLabel, 0, 0);

        this._secondPlayerLabel = new BABYLON.GUI.TextBlock();
        this._secondPlayerLabel.text = "Right Player";
        this._secondPlayerLabel.color = "white"
        this._secondPlayerLabel.fontSize = 24;
        scorePanel.addControl(this._secondPlayerLabel, 0, 2);

        this._firstPlayerScore = new BABYLON.GUI.TextBlock();
        this._firstPlayerScore.text = "0";
        this._firstPlayerScore.color = "white"
        this._firstPlayerScore.fontSize = 48;
        this._firstPlayerScore.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        scorePanel.addControl(this._firstPlayerScore, 1, 0);

        this._secondPlayerScore = new BABYLON.GUI.TextBlock();
        this._secondPlayerScore.text = "0";
        this._secondPlayerScore.color = "white"
        this._secondPlayerScore.fontSize = 48;
        this._secondPlayerScore.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        scorePanel.addControl(this._secondPlayerScore, 1, 2);

        panel.addControl(scorePanel, 2, 0);

        this._nextRound = BABYLON.GUI.Button.CreateSimpleButton("button", "Continue");
        this._nextRound.color = "white";
        this._nextRound.background = "green";
        this._nextRound.paddingBottom = "20%";
        this._nextRound.paddingLeft = "30%";
        this._nextRound.paddingRight = "30%";
        this._nextRound.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        panel.addControl(this._nextRound, 4, 0);

        this._roundEndedGui = panel;
    }

    private _constructGameEnded(): void { 
        var panel = new BABYLON.GUI.Grid();
        panel.width = 1;
        panel.height = 1;
        panel.background = "#00000080";
        panel.addColumnDefinition(1);
        panel.addRowDefinition(0.3);
        panel.addRowDefinition(0.15);
        panel.addRowDefinition(0.15);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.3);

        var title = new BABYLON.GUI.TextBlock();
        title.text = "Game ended...";
        title.color = "white"
        title.fontSize = 48;
        panel.addControl(title, 1, 0);

        this._gameEndedLabel = new BABYLON.GUI.TextBlock();
        this._gameEndedLabel.text = "It's a draw!";
        this._gameEndedLabel.color = "white"
        this._gameEndedLabel.fontSize = 36;
        this._gameEndedLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        panel.addControl(this._gameEndedLabel, 2, 0);

        var buttonsPanel = new BABYLON.GUI.Grid();
        buttonsPanel.width = 1;
        buttonsPanel.height = 1;
        buttonsPanel.addColumnDefinition(0.5);
        buttonsPanel.addColumnDefinition(0.5);

        this._newGame = BABYLON.GUI.Button.CreateSimpleButton("button", "Play Again");
        this._newGame.color = "white";
        this._newGame.background = "green";
        this._newGame.paddingLeft = "30%";
        this._newGame.paddingRight = "5%";
        buttonsPanel.addControl(this._newGame, 0, 0);

        this._goToMenu = BABYLON.GUI.Button.CreateSimpleButton("button", "Back To Menu");
        this._goToMenu.color = "white";
        this._goToMenu.background = "green";
        this._goToMenu.paddingLeft = "5%";
        this._goToMenu.paddingRight = "30%";
        buttonsPanel.addControl(this._goToMenu, 0, 1);

        panel.addControl(buttonsPanel, 3, 0);

        this._gameEndedGui = panel;
    }
}