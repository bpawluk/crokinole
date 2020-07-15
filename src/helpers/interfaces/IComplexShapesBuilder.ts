export interface IComplexShapesBuilder {
    buildRing(
        scene: BABYLON.Scene,
        innerRadius: number,
        outerRadius: number,
        height: number,
        tessellation: number
    ): Array<BABYLON.Mesh>;
}