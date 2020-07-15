import { injectable, inject } from "inversify";
import { IPhysicsProvider } from "./interfaces/IPhysicsProvider";
import { TYPES } from "../di/types";
import { IComplexShapesBuilder } from "../helpers/interfaces/IComplexShapesBuilder";

@injectable()
export class CrokinolePhysicsProvider implements IPhysicsProvider {
    @inject(TYPES.IComplexShapesBuilder) private _complexShapesBuilder: IComplexShapesBuilder;

    enablePhysics(scene: BABYLON.Scene, renderImpostors: boolean): void {
        scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
        var options = { mass: 0, restitution: 0, friction: 0 };
        var pinsOptions = { mass: 0, restitution: 0.75, friction: 0 };

        var impostors = [];

        // field
        var fieldFragments = this._complexShapesBuilder.buildRing(scene, 0.17, 3.35, 0.67, 20);
        fieldFragments.forEach((fragment) => fragment.physicsImpostor = new BABYLON.PhysicsImpostor(fragment, BABYLON.PhysicsImpostor.BoxImpostor, options, scene));
        impostors = impostors.concat(fieldFragments);

        // hole floor
        var holeFloor = BABYLON.MeshBuilder.CreateBox("holeFloor", { size: 0.4, height: 0.55 }, scene);
        holeFloor.physicsImpostor = new BABYLON.PhysicsImpostor(holeFloor, BABYLON.PhysicsImpostor.BoxImpostor, options, scene)
        impostors.push(holeFloor);

        // bands floor
        var outsideRing = BABYLON.MeshBuilder.CreateCylinder("outerField", { height: 0.6, diameter: 8.6, tessellation: 14 }, scene);
        outsideRing.position.y = -0.15;
        outsideRing.rotation.y = Math.PI / 14;
        outsideRing.physicsImpostor = new BABYLON.PhysicsImpostor(outsideRing, BABYLON.PhysicsImpostor.CylinderImpostor, options, scene);
        impostors.push(outsideRing);

        // bands
        var alpha = Math.PI / 7;
        var r = 4;
        var R = 4.05;
        var middleR = (r + R) / 2;
        var width = R - r;
        var length = 2 * r * Math.sin(alpha / 2) + 0.1;
        var height = 0.75;
        for (var i = 0; i < 14; i++) {
            var pin = BABYLON.MeshBuilder.CreateBox("band", { size: 1 }, scene);

            var angle = i * alpha;

            pin.rotation.y = -angle;

            pin.position.x = Math.cos(angle) * middleR;
            pin.position.z = Math.sin(angle) * middleR;

            pin.scaling.x = width;
            pin.scaling.y = height;
            pin.scaling.z = length;

            pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.BoxImpostor, options, scene);
            impostors.push(pin);
        }

        // pins
        alpha = Math.PI / 4;
        r = 0.04
        R = 1.025;
        height = 0.2
        for (var i = 0; i < 8; i++) {
            var pin = BABYLON.MeshBuilder.CreateCylinder("pin", { diameter: 2 * r, height: height, tessellation: 12 }, scene);

            var angle = i * alpha;

            pin.position.x = Math.cos(angle) * R;
            pin.position.y = 0.435;
            pin.position.z = Math.sin(angle) * R;

            pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.CylinderImpostor, pinsOptions, scene);
            impostors.push(pin);
        }


        var impostorMaterial = impostorMaterial = new BABYLON.StandardMaterial("fieldMat", scene);
        impostorMaterial.diffuseColor = new BABYLON.Color3(.2, 1, .2);

        impostors.forEach((impostor) => {
            if (renderImpostors) {
                impostor.material = impostorMaterial;
            } else {
                impostor.visibility = 0;
            }
        });
    }
}