import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IGameStateGui } from "./IGameStateGui";
import { IGuiProvider } from "./IGuiProvider";

@injectable()
export class GameStateGui implements IGameStateGui {
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;
    
    showGameState(): void {
        throw new Error("Method not implemented.");
    }

    hideGameState(): void {
        throw new Error("Method not implemented.");
    }

    setRound(): void {
        throw new Error("Method not implemented.");
    }

    setScore(): void {
        throw new Error("Method not implemented.");
    }

    setPawnsLeft(): void {
        throw new Error("Method not implemented.");
    }

    setMessage(): void {
        throw new Error("Method not implemented.");
    }
    
    clear(): void {
        throw new Error("Method not implemented.");
    }
}