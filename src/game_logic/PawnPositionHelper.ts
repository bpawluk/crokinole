import { IPawnPositionHelper } from "./interfaces/IPawnPositionHelper";
import { injectable } from "inversify";

@injectable()
export class PawnPositionHelper implements IPawnPositionHelper {
    private _startingPositions: Map<string, BABYLON.Vector3>;

    public constructor() {
        this._startingPositions = new Map<string, BABYLON.Vector3>();
        // TODO Move all to config
        this._startingPositions.set("Orange", new BABYLON.Vector3(2.2556, 0.395, 2.2556)); 
        this._startingPositions.set("Purple", new BABYLON.Vector3(-2.2556, 0.395, -2.2556));
    }

    isIn20Hole(position: BABYLON.Vector3): boolean {
        return this._distanceFromCenterSqaured(position) < 0.0289 && position.y <= 0.36;
    }

    isInCenter(position: BABYLON.Vector3) {
        return this._distanceFromCenterSqaured(position) <= 1.3924;
    }

    isOutOfField(position: BABYLON.Vector3): boolean {
        return this._distanceFromCenterSqaured(position) > 11.2225;
    }

    isOutOfBands(position: BABYLON.Vector3): boolean {
        return position.y < 0.16;
    }

    getPoints(position: BABYLON.Vector3): number {
        var distanceSquared = this._distanceFromCenterSqaured(position);
        if (distanceSquared <= 0.7396) {
            return 15;
        }
        else if (distanceSquared <= 3.5344) {
            return 10;
        }
        else if (distanceSquared <= 8.41) {
            return 5;
        }
        else {
            return 0;
        }
    }

    getStartingPosition(color: string): BABYLON.Vector3 {
        return this._startingPositions.get(color);
    }

    private _distanceFromCenterSqaured(position: BABYLON.Vector3): number {
        return position.x * position.x + position.z * position.z;
    }
}