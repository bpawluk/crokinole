export interface ICameraManager {
    setupCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene): void;
    moveCamera(to: BABYLON.Vector3): void;
    resetCamera(): void;
}