export interface IPointerEventsManager {
    registerOneCallListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void);
    registerListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void): void;
    unregisterListener(eventType: number, callback: (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void): void;
}