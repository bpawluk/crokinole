import { injectable } from "inversify";
import { IComplexShapesBuilder } from "./interfaces/IComplexShapesBuilder";

@injectable()
export class ComplexShapesBuilder implements IComplexShapesBuilder {
    buildRing(scene: BABYLON.Scene, innerRadius: number, outerRadius: number, height: number, tessellation: number): Array<BABYLON.Mesh> {
        var boxes = [];

        var alpha = (2 * Math.PI) / tessellation;
        var length = outerRadius - innerRadius;
        var width = 2 * outerRadius * Math.sin(alpha / 2);
        var centerRadius = innerRadius + length / 2;

        for (var i = 0; i < tessellation; i++) {
            var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);

            var angle = i * alpha;
            box.rotation.y = -angle + Math.PI * 0.5;

            box.position.x = Math.cos(angle) * centerRadius;
            box.position.z = Math.sin(angle) * centerRadius;

            box.scaling.x = width;
            box.scaling.y = height;
            box.scaling.z = length;

            boxes.push(box);
        }
        return boxes;
    }
}