export interface IPlayer {
    readonly color: string;
    move(): Promise<void>;
}