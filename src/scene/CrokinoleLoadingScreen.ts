import { injectable } from "inversify";

@injectable()
export class CrokinoleLoadingScreen implements BABYLON.ILoadingScreen {
    loadingUIBackgroundColor: string;
    loadingUIText: string;

    displayLoadingUI() { }

    hideLoadingUI() {
        window.document.getElementById("loadingScreen").style.display = "none";
    }
}