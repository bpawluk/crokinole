import { IMenuGui } from "./IMenuGui";
import { injectable } from "inversify";

@injectable()
export class MenuGui implements IMenuGui {
    showMainMenu(): void {
        throw new Error("Method not implemented.");
    }

    showPauseMenu(): void {
        throw new Error("Method not implemented.");
    }

    showRoundEnded(): void {
        throw new Error("Method not implemented.");
    }
    
    showGameEnded(): void {
        throw new Error("Method not implemented.");
    }
}