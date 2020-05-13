import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IPlayerFactory } from "./IPlayerFactory";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { IUserInput } from "../services/IUserInput";
import { IPlayer } from "./IPlayer";
import { LocalPlayer } from "./LocalPlayer";
import { ICameraManager } from "../services/ICameraManager";

@injectable()
export class PlayerFactory implements IPlayerFactory {
    // TODO: Remove 
    @inject(TYPES.ISceneBuilder) private _sceneProvider: ISceneBuilder;

    @inject(TYPES.IUserInput) private _userInput: IUserInput;
    @inject(TYPES.ICameraManager) private _cameraManager: ICameraManager;
    
    provideLocalPlayer(color: string): IPlayer {
        return new LocalPlayer(color, this._sceneProvider, this._cameraManager, this._userInput);
    }
}