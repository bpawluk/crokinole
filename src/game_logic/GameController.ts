import { inject, injectable, id } from "inversify";
import { TYPES } from "../di/types";
import { IGameController } from "./IGameController";
import { IPlayerFactory } from "./IPlayerFactory";
import { GameState } from "../model/GameState";
import { IMenuGui } from "../gui/IMenuGui";
import { IGameStateGui } from "../gui/IGameStateGui";
import { IPawnPositionHelper } from "./IPawnPositionHelper";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { Pawn } from "../model/Pawn";

@injectable()
export class GameController implements IGameController {
    private _gameState: GameState;
    private _onStepTarget: BABYLON.PhysicsImpostor;
    private _isFreeShot: boolean;
    private _newPawn: Pawn;

    private _collided: Set<Pawn>;
    private _colliders: Array<BABYLON.PhysicsImpostor>;
    private _collisionDetector: (collider: BABYLON.PhysicsImpostor, collidedAgainst: BABYLON.PhysicsImpostor) => void;

    @inject(TYPES.IMenuGui) _menuGui: IMenuGui;
    @inject(TYPES.IGameStateGui) _gameGui: IGameStateGui;
    @inject(TYPES.IPlayerFactory) _playerFactory: IPlayerFactory
    @inject(TYPES.IPawnPositionHelper) _pawnPositionHelper: IPawnPositionHelper;
    @inject(TYPES.ISceneBuilder) _sceneProvider: ISceneBuilder;

    async startGame(): Promise<void> {
        this._initGame();
        this._gameGui.showGameState();

        while (true) {
            await this._updateGui();

            if (this._gameState.isGameFinished()) break;

            this._isFreeShot = this._gameState.isFreeShot();
            

            this._newPawn = await this._gameState.nextPlayer().move();
            this._gameState.playerMoved(this._newPawn);
            if (!this._isFreeShot) this._saveCollisions();

            await this._whenAllStopped();
            this._disposeOutOfPlayPawns();
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
        this._gameState = new GameState([whitePlayer, blackPlayer], this._pawnPositionHelper);
        this._onStepTarget = this._sceneProvider.scene.getMeshByName("outerField").physicsImpostor;
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
        var pawns = this._gameState.getPawns();
        var pawnsInGame = pawns.filter(pawn => pawn.isInPlay);
        if (pawnsInGame.length > 0) {
            var toRegister: (impostor: BABYLON.PhysicsImpostor) => void;
            await new Promise<void>(resolve => {
                toRegister = (impostor) => {
                    if (pawnsInGame.every(pawn => pawn.isStopped())) {
                        resolve();
                    }
                }
                this._onStepTarget.registerAfterPhysicsStep(toRegister);
            });
            this._onStepTarget.unregisterAfterPhysicsStep(toRegister);
        }
    }

    private _saveCollisions(): void {
        this._collided = new Set<Pawn>();
        var pawns = this._gameState.getPawns().filter(pawn => pawn.isInPlay);
        this._colliders = pawns.map(pawn => pawn.getMesh().physicsImpostor);
        this._collisionDetector = (collider, collidedAgainst) => {
            var collidedAgainstPawn = pawns.find(pawn => pawn.getMesh().physicsImpostor == collidedAgainst);
            if(collidedAgainstPawn) this._collided.add(collidedAgainstPawn);
        };
        pawns.forEach(pawn => {
            if (pawn.isInPlay) {
                pawn.getMesh().physicsImpostor.registerOnPhysicsCollide(this._colliders, this._collisionDetector);
            }
        });
    }

    private _disposeOutOfPlayPawns(): void {
        if (!this._isFreeShot) {
            if(!Array.from(this._collided).find(pawn => pawn.color == this._gameState.nextPlayer().color)) {
                this._newPawn.disposePawn();
                this._collided.forEach(pawn => {
                    if (pawn && pawn.isInPlay) {
                        pawn.disposePawn();
                    }
                })
            }
            this._gameState.getPawns().forEach(pawn => {
                if(pawn && pawn.isInPlay) {
                    pawn.getMesh().physicsImpostor.unregisterOnPhysicsCollide(this._colliders, this._collisionDetector);
                }
            });
        } else {
            if(!this._pawnPositionHelper.isInCenter(this._newPawn.getMesh().position)) {
                this._newPawn.disposePawn();
            }
        }

        this._gameState.getPawns().forEach(pawn => {
            if (pawn.isInPlay) {
                if (this._pawnPositionHelper.isIn20Hole(pawn.getMesh().position)) {
                    pawn.removeFrom20Hole();
                } else if (this._pawnPositionHelper.isOutOfField(pawn.getMesh().position)) {
                    pawn.disposePawn();
                }
            }
        });
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