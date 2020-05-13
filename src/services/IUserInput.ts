export interface IUserInput {
    registerOneCallPointerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void);
    registerPointerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void): void;
    unregisterPointerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void): void;
}