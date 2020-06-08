import { IMenuGui } from "./IMenuGui";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IGuiProvider } from "./IGuiProvider";

@injectable()
export class MenuGui implements IMenuGui {
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;

    // main menu gui
    private _mainMenuGui: BABYLON.GUI.Control;
    private _local: BABYLON.GUI.Button;

    public constructor() {
        this._constructMainMenuGui();
    }

    showMainMenu(startLocal: Function): void {
        this._guiProvider.attachControl(this._mainMenuGui);
        this._local.onPointerUpObservable.addOnce((data, state) => {
            this._guiProvider.detachControl(this._mainMenuGui)
            startLocal();
        });
    }

    showPauseMenu(): void {
        throw new Error("Method not implemented.");
    }

    showRoundEnded(): void {
        throw new Error("Method not implemented.");
    }

    showGameEnded(): void {
        throw new Error("Method not implemented.");
    }

    private _constructMainMenuGui(): void {
        var panel = new BABYLON.GUI.Grid();
        panel.width = 1;
        panel.height = 1;
        panel.background = "#00000080";
        panel.addColumnDefinition(0.3);
        panel.addColumnDefinition(0.4);
        panel.addColumnDefinition(0.3);
        panel.addRowDefinition(0.25);
        panel.addRowDefinition(0.2);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.1);
        panel.addRowDefinition(0.25);

        var title = new BABYLON.GUI.TextBlock();
        title.text = "Online Crokinole";
        title.color = "white"
        title.fontSize = 56;
        title.paddingBottom = "15%";
        panel.addControl(title, 1, 1);

        var online = BABYLON.GUI.Button.CreateSimpleButton("moveLeft", "Online Multiplayer");
        online.color = "white";
        online.background = "green";
        online.isEnabled = false;
        online.paddingBottom = "15%";
        panel.addControl(online, 2, 1);

        this._local = BABYLON.GUI.Button.CreateSimpleButton("moveLeft", "Local Multiplayer");
        this._local.color = "white";
        this._local.background = "green";
        this._local.paddingBottom = "15%";
        panel.addControl(this._local, 3, 1);

        var howToPlay = BABYLON.GUI.Button.CreateSimpleButton("moveLeft", "How to play");
        howToPlay.color = "white";
        howToPlay.background = "green";
        howToPlay.isEnabled = false;
        howToPlay.paddingBottom = "15%";
        panel.addControl(howToPlay, 4, 1);

        this._mainMenuGui = panel;
    }
}