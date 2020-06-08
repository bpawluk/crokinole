import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IMakingMoveGui } from "./IMakingMoveGui";
import { IGuiProvider } from "./IGuiProvider";
import { IUserInput } from "../services/IUserInput";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";

@injectable()
export class MakingMoveGui implements IMakingMoveGui {
    @inject(TYPES.IGuiProvider) private _guiProvider: IGuiProvider;
    @inject(TYPES.IUserInput) private _userInput: IUserInput;
    private _scene: BABYLON.Scene;

    // choosePositionGui
    private _choosePositionGui: BABYLON.GUI.Control;
    private _moveLeft: BABYLON.GUI.Button;
    private _accept: BABYLON.GUI.Button;
    private _moveRight: BABYLON.GUI.Button;

    // chooseContactPointGui
    private _contactPointMarker: BABYLON.Mesh;

    // chooseDirectionGui
    private _mousePicker: BABYLON.Mesh;
    private _directionIndicator: BABYLON.Mesh;
    private _directionIndicatorPointer: BABYLON.Mesh;

    // chooseForce
    private _progressBar: BABYLON.GUI.Control;
    private _progressBarWidth = 400;

    init(scene: BABYLON.Scene): void {
        this._scene = scene;
        this._constructChoosePositionGui();
        this._constructChooseContactPointGui();
        this._constructChooseDirectionGui();
        this._constructChooseForceGui();
    }

    showChoosePositionGui(moveLeft: Function, moveRight: Function, accept: Function): void {
        var moveLeftInterval, moveRightInterval;

        this._guiProvider.attachControl(this._choosePositionGui);

        this._moveLeft.onPointerDownObservable.add((data, state) => {
            moveLeftInterval = setInterval(() => moveLeft(), 25);
        });
        this._moveLeft.onPointerUpObservable.add((data, state) => {
            clearInterval(moveLeftInterval);
        });

        this._moveRight.onPointerDownObservable.add((data, state) => {
            moveRightInterval = setInterval(() => moveRight(), 25);
        });
        this._moveRight.onPointerUpObservable.add((data, state) => {
            clearInterval(moveRightInterval);
        });

        this._accept.onPointerUpObservable.addOnce((data, state) => {
            this._moveLeft.onPointerDownObservable.clear();
            this._moveLeft.onPointerUpObservable.clear();
            this._moveRight.onPointerDownObservable.clear();
            this._moveRight.onPointerUpObservable.clear();
            this._guiProvider.detachControl(this._choosePositionGui)
            accept();
        });
    }

    showChooseContactPointGui(disc: BABYLON.Mesh, setContactPoint: Function, accept: Function): void {
        var pickInfo: BABYLON.PickingInfo;
        this._contactPointMarker.position = disc.position;
        this._contactPointMarker.isVisible = true;

        var onPointerMove = (info, event) => {
            pickInfo = this._scene.pick(this._scene.pointerX, this._scene.pointerY, (mesh) => mesh == disc);
            if (pickInfo.hit) {
                this._contactPointMarker.position = pickInfo.pickedPoint;
                setContactPoint(pickInfo.pickedPoint);
            }
        };

        this._userInput.registerPointerListener(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove);
        this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (info, event) => {
            this._userInput.unregisterPointerListener(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove);
            this._contactPointMarker.isVisible = false;
            this._contactPointMarker.position = BABYLON.Vector3.ZeroReadOnly;
            accept();
        });
    }

    showChooseDirectionGui(disc: BABYLON.Mesh, defaultDirection: BABYLON.Vector3, setDirection: Function, accept: Function): void {
        var pickInfo: BABYLON.PickingInfo;
        this._mousePicker.position.y = disc.position.y;
        this._directionIndicator.position = disc.position;
        this._rotateDirectionIndicator(BABYLON.Vector3.ZeroReadOnly.subtract(disc.position));
        this._setDirectionIndicatorVisibility(true);

        var onPointerMove = (info, event) => {
            pickInfo = this._scene.pick(this._scene.pointerX, this._scene.pointerY, (mesh) => mesh == this._mousePicker);
            if (pickInfo.hit && !pickInfo.pickedPoint.equals(disc.position)) {
                var normalizedPoint = pickInfo.pickedPoint.subtract(disc.position);
                this._rotateDirectionIndicator(normalizedPoint);
                setDirection(normalizedPoint);
            }
        };

        this._userInput.registerPointerListener(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove);
        this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (info, event) => {
            this._userInput.unregisterPointerListener(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove);
            this._setDirectionIndicatorVisibility(false);
            accept();
        });
    }

    private _setDirectionIndicatorVisibility(isVisible: boolean) {
        this._directionIndicator.isVisible = isVisible;
        this._directionIndicator.getChildMeshes().forEach((child) => child.isVisible = isVisible);
    }


    private _rotateDirectionIndicator(toPoint: BABYLON.Vector3) {
        this._directionIndicator.rotation.y = -Math.atan2(toPoint.z, toPoint.x);
    }

    showChooseForceGui(setForce: Function, accept: Function): void {
        var step = 0.02
        var minForce = 0.05;
        var maxForce = 1;
        var force = minForce;
        this._progressBar.widthInPixels = force * this._progressBarWidth;
        this._guiProvider.attachControl(this._progressBar);

        var chooseForce = setInterval(() => {
            if (force + step < minForce || force + step > maxForce) step = -step;
            force += step;
            this._progressBar.widthInPixels = force * this._progressBarWidth;
        }, 10);

        this._userInput.registerOneCallPointerListener(BABYLON.PointerEventTypes.POINTERDOWN, (info, event) => {
            clearInterval(chooseForce);
            this._guiProvider.detachControl(this._progressBar);
            setForce(force);
            accept();
        });
    }

    private _constructChoosePositionGui() {
        var panel = new BABYLON.GUI.Grid();
        panel.width = 0.5;
        panel.height = 0.25;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.addColumnDefinition(0.3);
        panel.addColumnDefinition(10, true);
        panel.addColumnDefinition(0.3);
        panel.addColumnDefinition(10, true);
        panel.addColumnDefinition(0.3);

        this._moveLeft = BABYLON.GUI.Button.CreateSimpleButton("moveLeft", "Left");
        this._moveLeft.height = "50px";
        this._moveLeft.color = "white";
        this._moveLeft.background = "green";
        panel.addControl(this._moveLeft, 0, 0);

        this._accept = BABYLON.GUI.Button.CreateSimpleButton("accept", "Accept");
        this._accept.height = "50px";
        this._accept.color = "white";
        this._accept.background = "green";
        panel.addControl(this._accept, 0, 2);

        this._moveRight = BABYLON.GUI.Button.CreateSimpleButton("moveRight", "Right");
        this._moveRight.height = "50px";
        this._moveRight.color = "white";
        this._moveRight.background = "green";
        panel.addControl(this._moveRight, 0, 4);

        this._choosePositionGui = panel;
    }

    private _constructChooseContactPointGui(): void {
        this._contactPointMarker = BABYLON.MeshBuilder.CreateSphere("red", { diameter: 0.05 }, this._scene);
        this._contactPointMarker.material = this._scene.getMaterialByID("Green");
        this._contactPointMarker.isVisible = false;
    }

    private _constructChooseDirectionGui(): void {
        this._mousePicker = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this._scene);
        this._mousePicker.isVisible = false;

        var ringDiamater = 0.45
        var ring = BABYLON.MeshBuilder.CreateCylinder("ring", { height: .005, diameter: ringDiamater, tessellation: 32 }, this._scene);
        ring.material = this._scene.getMaterialByID("Green");

        var pointerLine = BABYLON.MeshBuilder.CreateBox("pointer", { width: 0.5, depth: 0.08, height: .005 }, this._scene);
        pointerLine.material = this._scene.getMaterialByID("Green");

        var corners = [new BABYLON.Vector2(0, 0.1), new BABYLON.Vector2(-0.1, -0.1), new BABYLON.Vector2(0, -0.05), new BABYLON.Vector2(0.1, -0.1)];
        var builder = new BABYLON.PolygonMeshBuilder("polytri", corners, this._scene);
        var pointerTip = builder.build(null, 0.005);
        pointerTip.rotate(new BABYLON.Vector3(0,1,0), Math.PI/2);
        pointerTip.position.x = 0.25;
        pointerTip.material = this._scene.getMaterialByID("Green");

        this._directionIndicatorPointer = new BABYLON.Mesh("directionIndicatorPointer", this._scene);
        this._directionIndicatorPointer.addChild(pointerLine);
        this._directionIndicatorPointer.addChild(pointerTip);
        this._directionIndicatorPointer.position = ring.position.add(new BABYLON.Vector3(ringDiamater / 2, 0, 0));

        this._directionIndicator = new BABYLON.Mesh("directionIndicator", this._scene);
        this._directionIndicator.addChild(ring);
        this._directionIndicator.addChild(this._directionIndicatorPointer);

        this._setDirectionIndicatorVisibility(false);
    }

    private _constructChooseForceGui(): void {
        var progressBar = BABYLON.GUI.Button.CreateSimpleButton("progressBar", "");
        progressBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        progressBar.height = "30px";
        progressBar.widthInPixels = this._progressBarWidth;
        progressBar.color = "white";
        progressBar.background = "green";
        progressBar.paddingBottomInPixels = 50;
        this._progressBar = progressBar;
    }
}