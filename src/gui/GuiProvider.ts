import { injectable, inject } from "inversify";
import { IGuiProvider } from "./interfaces/IGuiProvider";
import { SceneInitialable } from "../utils/SceneInitialable";
import { ISceneBuilder } from "../scene/interfaces/ISceneBuilder";
import { TYPES } from "../di/types";

@injectable()
export class GuiProvider extends SceneInitialable implements IGuiProvider {
    private _guiCanvas: BABYLON.GUI.AdvancedDynamicTexture;

    constructor(@inject(TYPES.ISceneBuilder) sceneBuilder: ISceneBuilder) {
        super(sceneBuilder);
    }

    attachControl(control: BABYLON.GUI.Control): void {
        this._guiCanvas.addControl(control);
    }

    detachControl(control: BABYLON.GUI.Control): void {
        this._guiCanvas.removeControl(control);
    }

    clear(): void {
        this._guiCanvas.getDescendants(true).forEach((control) => this.detachControl(control));
    }

    protected _init(scene: BABYLON.Scene): void {
        super._init(scene);
        this._guiCanvas = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("crokinole", true, scene);
    }
}