export interface IMenuGui {
    showMainMenu(startLocal: Function): void;
    showPauseMenu(resume: Function, goToMenu: Function): void;
    showNextTurn(makeMove: Function, nextPlayer: string): void;
    showRoundEnded(nextRound: Function, winner: string, firstPlayer: string, firstScore: number, secondPlayer: string, secondScore: number): void;
    showGameEnded(newGame: Function, goToMenu: Function, winner: string): void;
}