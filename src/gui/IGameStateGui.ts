export interface IGameStateGui {
    showGameState(): void;
    hideGameState(): void;
    setRound(): void;
    setScore(): void;
    setPawnsLeft(): void;
    setMessage(): void;
    clear(): void;
}