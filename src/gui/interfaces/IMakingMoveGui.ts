export interface IMakingMoveGui {
    init(scene: BABYLON.Scene): void;
    showChoosePositionGui(moveLeft: Function, moveRight: Function, accept: Function): void;
    showChooseContactPointGui(disc: BABYLON.Mesh, setContactPoint: Function, accept: Function): void;
    showChooseDirectionGui(disc: BABYLON.Mesh, defaultDirection: BABYLON.Vector3, setDirection: Function, accept: Function): void;
    showChooseForceGui(setForce: Function, accept: Function): void;
}