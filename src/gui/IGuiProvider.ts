export interface IGuiProvider {
    init(scene: BABYLON.Scene): void
    attachControl(control: BABYLON.GUI.Control): void;
    detachControl(control: BABYLON.GUI.Control): void;
    clear(): void;
}