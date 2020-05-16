import { injectable, inject } from "inversify";
import { IGuiProvider } from "./IGuiProvider";
import { TYPES } from "../di/types";

@injectable()
export class GuiProvider implements IGuiProvider {
    private _guiCanvas: BABYLON.GUI.AdvancedDynamicTexture;

    init(scene: BABYLON.Scene): void {
        this._guiCanvas = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("crokinole", true, scene);
    }

    attachControl(control: BABYLON.GUI.Control): void {
        this._guiCanvas.addControl(control);
    }

    detachControl(control: BABYLON.GUI.Control): void {
        this._guiCanvas.removeControl(control);
    }
}