export interface IPawnPositionHelper {
    isIn20Hole(position: BABYLON.Vector3): boolean;
    isInCenter(position: BABYLON.Vector3): boolean;
    isOutOfField(position: BABYLON.Vector3): boolean;
    isOutOfBands(position: BABYLON.Vector3): boolean;
    getPoints(position: BABYLON.Vector3): number;
    getStartingPosition(color: string): BABYLON.Vector3;
}