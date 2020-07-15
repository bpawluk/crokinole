import { IMaterialsProvider } from "./interfaces/IMaterialsProvider";

export class StandardMaterialProvider implements IMaterialsProvider {
    getMaterial(name: string): BABYLON.Material {
        throw new Error("Method not implemented.");
    }
}