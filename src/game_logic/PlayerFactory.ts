import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IPlayerFactory } from "./interfaces/IPlayerFactory";
import { IPlayer } from "./interfaces/IPlayer";
import { LocalPlayer } from "./LocalPlayer";
import { ICameraManager } from "../scene/interfaces/ICameraManager";
import { IMakingMoveGui } from "../gui/interfaces/IMakingMoveGui";
import { IPawnProvider } from "./interfaces/IPawnProvider";

@injectable()
export class PlayerFactory implements IPlayerFactory {
    @inject(TYPES.ICameraManager) private _cameraManager: ICameraManager;
    @inject(TYPES.IMakingMoveGui) private _makingMoveGui: IMakingMoveGui;
    @inject(TYPES.IPawnProvider) private _pawnProvider: IPawnProvider;
    
    provideLocalPlayer(color: string): IPlayer {
        return new LocalPlayer(color, this._cameraManager, this._makingMoveGui, this._pawnProvider);
    }
}