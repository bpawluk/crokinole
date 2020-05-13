import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IUserInput } from "./IUserInput";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";

@injectable()
export class UserInput implements IUserInput {
    private _isInit;
    private _pointerActionObservables: Map<number, BABYLON.Observable<BABYLON.PointerInfo>>
    @inject(TYPES.ISceneBuilder) private _sceneProvider: ISceneBuilder;

    constructor() {
        this._isInit = false;
        this._pointerActionObservables = new Map<number, BABYLON.Observable<BABYLON.PointerInfo>>();
    }

    registerOneCallPointerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void) {
        this._lazyInit();
        this._lazyCreatePointerActionObservable(eventType);
        this._pointerActionObservables.get(eventType).addOnce(callback);
    }

    registerPointerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void): void {
        this._lazyInit();
        this._lazyCreatePointerActionObservable(eventType);
        this._pointerActionObservables.get(eventType).add(callback);
    }

    unregisterPointerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void): void {
        this._lazyInit();
        this._lazyCreatePointerActionObservable(eventType);
        this._pointerActionObservables.get(eventType).removeCallback(callback);
    }

    private _pointerActionListener(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        if(this._pointerActionObservables.has(pointerInfo.type)) {
            this._pointerActionObservables.get(pointerInfo.type).notifyObservers(pointerInfo);
        }
    }

    private _lazyInit() {
        if(!this._isInit){
            this._sceneProvider.scene.onPointerObservable.add(this._pointerActionListener.bind(this))
            this._isInit = true;
        }
    }

    private _lazyCreatePointerActionObservable(eventType: number) {
        if (!this._pointerActionObservables.has(eventType)) {
            this._pointerActionObservables.set(eventType, new BABYLON.Observable<BABYLON.PointerInfo>());
        }
    }
}