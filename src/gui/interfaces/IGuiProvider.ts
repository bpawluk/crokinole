export interface IGuiProvider {
    attachControl(control: BABYLON.GUI.Control): void;
    detachControl(control: BABYLON.GUI.Control): void;
    clear(): void;
}