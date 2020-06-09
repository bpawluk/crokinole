export class Score {
    points: number;
    score: number;
    movesLeft: number;

    public constructor(maxMoves: number) {
        this.points = 0;
        this.score = 0;
        this.movesLeft = maxMoves;
    }
}