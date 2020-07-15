export interface IMaterialsProvider {
    getMaterial(name: string): BABYLON.Material;
}