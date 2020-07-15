import { Score } from "../../model/Score";

export interface IGameStateGui {
    showGameState(): void;
    hideGameState(): void;
    setScores(firstPlayer: string, firstScore: Score, secondPlayer: string, secondScore: Score): void;
    setMessage(): void;
    clear(): void;
}