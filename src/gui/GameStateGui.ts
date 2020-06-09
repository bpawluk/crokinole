import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IGameStateGui } from "./IGameStateGui";
import { IGuiProvider } from "./IGuiProvider";
import { Score } from "../model/Score";

@injectable()
export class GameStateGui implements IGameStateGui {
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;

    private _gameStateGui: BABYLON.GUI.Control;

    // first player
    private _firstLabel: BABYLON.GUI.TextBlock;
    private _firstScore: BABYLON.GUI.TextBlock;
    private _firstMoves: BABYLON.GUI.TextBlock;

    // second player
    private _secondLabel: BABYLON.GUI.TextBlock;
    private _secondScore: BABYLON.GUI.TextBlock;
    private _secondMoves: BABYLON.GUI.TextBlock;

    public constructor() {
        this._constructScoreGui();
    }
    
    showGameState(): void {
        this._guiProvider.attachControl(this._gameStateGui);
    }

    hideGameState(): void {
        this._guiProvider.detachControl(this._gameStateGui);
    }

    clear(): void {
        this._firstLabel.text = "Left player";
        this._firstScore.text = "0 / 0";
        this._firstMoves.text = "12";
        this._secondLabel.text = "Right player";
        this._secondScore.text = "0 / 0";
        this._secondMoves.text = "12";
    }

    setScores(firstPlayer: string, firstScore: Score, secondPlayer: string, secondScore: Score): void {
        this._firstLabel.text = firstPlayer + " player";
        this._firstScore.text = firstScore.score + " / " + firstScore.points;
        this._firstMoves.text = firstScore.movesLeft.toString();
        this._secondLabel.text = secondPlayer + " player";
        this._secondScore.text = secondScore.score + " / " + secondScore.points;
        this._secondMoves.text = secondScore.movesLeft.toString();
    }

    setMessage(): void {
        throw new Error("Method not implemented.");
    }

    private _constructScoreGui(): void {
        var panel = new BABYLON.GUI.Grid();
        panel.width = 1;
        panel.height = 1;
        panel.addColumnDefinition(0.5);
        panel.addColumnDefinition(0.5);
        panel.addRowDefinition(1);

        var leftPanel = new BABYLON.GUI.StackPanel();
        leftPanel.paddingTop = "5%";
        leftPanel.paddingLeft = "5%";
        leftPanel.width = 1;
        leftPanel.height = 1;
        leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

        this._firstLabel = new BABYLON.GUI.TextBlock();
        this._firstLabel.heightInPixels = 50;
        this._firstLabel.text = "Left player";
        this._firstLabel.color = "white"
        this._firstLabel.fontSize = 36;
        this._firstLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftPanel.addControl(this._firstLabel);

        var firstScoreLabel = new BABYLON.GUI.TextBlock();
        firstScoreLabel.heightInPixels = 50;
        firstScoreLabel.text = "SCORE";
        firstScoreLabel.color = "white"
        firstScoreLabel.fontSize = 18;
        firstScoreLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftPanel.addControl(firstScoreLabel);

        this._firstScore = new BABYLON.GUI.TextBlock();
        this._firstScore.heightInPixels = 50;
        this._firstScore.text = "0 / 0";
        this._firstScore.color = "white"
        this._firstScore.fontSize = 36;
        this._firstScore.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftPanel.addControl(this._firstScore);

        var firstMovesLabel = new BABYLON.GUI.TextBlock();
        firstMovesLabel.heightInPixels = 50;
        firstMovesLabel.text = "MOVES LEFT";
        firstMovesLabel.color = "white"
        firstMovesLabel.fontSize = 18;
        firstMovesLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftPanel.addControl(firstMovesLabel);

        this._firstMoves = new BABYLON.GUI.TextBlock();
        this._firstMoves.heightInPixels = 50;
        this._firstMoves.text = "12";
        this._firstMoves.color = "white"
        this._firstMoves.fontSize = 36;
        this._firstMoves.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftPanel.addControl(this._firstMoves);

        panel.addControl(leftPanel, 0, 0);

        var rightPanel = new BABYLON.GUI.StackPanel();
        rightPanel.width = 1;
        rightPanel.height = 1;
        rightPanel.paddingTop = "5%";
        rightPanel.paddingRight = "5%";
        rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

        this._secondLabel = new BABYLON.GUI.TextBlock();
        this._secondLabel.heightInPixels = 50;
        this._secondLabel.text = "Right player";
        this._secondLabel.color = "white"
        this._secondLabel.fontSize = 36;
        this._secondLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightPanel.addControl(this._secondLabel);

        var secondScoreLabel = new BABYLON.GUI.TextBlock();
        secondScoreLabel.heightInPixels = 50;
        secondScoreLabel.text = "SCORE";
        secondScoreLabel.color = "white"
        secondScoreLabel.fontSize = 18;
        secondScoreLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightPanel.addControl(secondScoreLabel);

        this._secondScore = new BABYLON.GUI.TextBlock();
        this._secondScore.heightInPixels = 50;
        this._secondScore.text = "0 / 0";
        this._secondScore.color = "white"
        this._secondScore.fontSize = 36;
        this._secondScore.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightPanel.addControl(this._secondScore);

        var secondMovesLabel = new BABYLON.GUI.TextBlock();
        secondMovesLabel.heightInPixels = 50;
        secondMovesLabel.text = "MOVES LEFT";
        secondMovesLabel.color = "white"
        secondMovesLabel.fontSize = 18;
        secondMovesLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightPanel.addControl(secondMovesLabel);

        this._secondMoves = new BABYLON.GUI.TextBlock();
        this._secondMoves.heightInPixels = 50;
        this._secondMoves.text = "12";
        this._secondMoves.color = "white"
        this._secondMoves.fontSize = 36;
        this._secondMoves.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightPanel.addControl(this._secondMoves);

        panel.addControl(rightPanel, 0, 1);

        this._gameStateGui = panel;
    }
}