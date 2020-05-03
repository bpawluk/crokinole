class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        console.log('loading scene');
        BABYLON.SceneLoader.Load("", "crokinole.babylon", this._engine, (scene) => this.onSceneLoaded(scene));
        this.initScene();
    }

    onSceneLoaded(scene: BABYLON.Scene): void {
        this._scene = scene;
        scene.executeWhenReady(() => this.initScene());
    }

    initScene(): void {
        console.log('scene ready');
        this.enablePhysics(false);
        this.generateLights();
        this.setupCamera();
        this._scene.actionManager = new BABYLON.ActionManager(this._scene);
        this._scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnKeyDownTrigger, parameter: 'd' }, () => this.setupDiscTest()));
        this.doRender();
    }

    generateLights(): void {
        new BABYLON.SpotLight("left", new BABYLON.Vector3(5, 3.5, 0), new BABYLON.Vector3(-1, -1, 0), Math.PI / 2, 1, this._scene).intensity = 100;
        new BABYLON.SpotLight("right", new BABYLON.Vector3(-5, 3.5, 0), new BABYLON.Vector3(1, -1, 0), Math.PI / 2, 1, this._scene).intensity = 100;
        new BABYLON.SpotLight("top", new BABYLON.Vector3(0, 3.5, 5), new BABYLON.Vector3(0, -1, -1), Math.PI / 2, 1, this._scene).intensity = 100;
        new BABYLON.SpotLight("bottom", new BABYLON.Vector3(0, 3.5, -5), new BABYLON.Vector3(0, -1, 1), Math.PI / 2, 1, this._scene).intensity = 100;
        console.log('lights lit');
    }

    setupCamera(): void {
        this._camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 7.5, 12.5), this._scene);
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.attachControl(this._canvas);
        console.log('camera attached');
    }

    enablePhysics(renderImpostors: boolean): void {
        this._scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
        var options = { mass: 0, restitution: 0.6, friction: 0.005 };

        var impostors = [];

        // field
        impostors = impostors.concat(this.createRing(this._scene, 0.17, 3.35, 0.67, 32, options));

        // hole floor
        var holeFloor = BABYLON.MeshBuilder.CreateBox("holeFloor", { size: 0.4, height: 0.55 }, this._scene);
        holeFloor.physicsImpostor = new BABYLON.PhysicsImpostor(holeFloor, BABYLON.PhysicsImpostor.BoxImpostor, options, this._scene)
        impostors.push(holeFloor);

        // bands floor
        var outsideRing = BABYLON.MeshBuilder.CreateCylinder("outerField", { height: 0.6, diameter: 8.4, tessellation: 14 }, this._scene);
        outsideRing.position.y = -0.15;
        outsideRing.rotation.y = Math.PI / 14;
        outsideRing.physicsImpostor = new BABYLON.PhysicsImpostor(outsideRing, BABYLON.PhysicsImpostor.CylinderImpostor, options, this._scene);
        impostors.push(outsideRing);

        // bands
        var alpha = Math.PI / 7;
        var r = 4;
        var R = 4.05;
        var middleR = (r + R) / 2;
        var width = R - r;
        var length = 2 * r * Math.sin(alpha / 2);
        var height = 0.75;
        for (var i = 0; i < 14; i++) {
            var pin = BABYLON.MeshBuilder.CreateBox("band", { size: 1 }, this._scene);

            var angle = i * alpha;

            pin.rotation.y = -angle;

            pin.position.x = Math.cos(angle) * middleR;
            pin.position.z = Math.sin(angle) * middleR;

            pin.scaling.x = width;
            pin.scaling.y = height;
            pin.scaling.z = length;

            pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.BoxImpostor, options, this._scene);
            impostors.push(pin);
        }

        // pins
        alpha = Math.PI / 4;
        r = 0.04
        R = 1.025;
        height = 0.2
        for (var i = 0; i < 8; i++) {
            var pin = BABYLON.MeshBuilder.CreateCylinder("pin", { diameter: 2 * r, height: height, tessellation: 32 }, this._scene);
            
            var angle = i * alpha;

            pin.position.x = Math.cos(angle) * R;
            pin.position.y = 0.435;
            pin.position.z = Math.sin(angle) * R;

            pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.CylinderImpostor, options, this._scene);
            impostors.push(pin);
        }


        var impostorMaterial = impostorMaterial = new BABYLON.StandardMaterial("fieldMat", this._scene);
        impostorMaterial.diffuseColor = new BABYLON.Color3(.2, 1, .2);

        impostors.forEach((impostor) => {
            if (renderImpostors) {
                impostor.material = impostorMaterial;
            } else {
                impostor.visibility = 0;
            }
        });

        console.log('physics enabled');
    }

    setupDiscTest(): void {
        var discMat = new BABYLON.StandardMaterial("discMat", this._scene);
        discMat.diffuseColor = new BABYLON.Color3(.2, .2, 1);

        var disc = BABYLON.MeshBuilder.CreateCylinder("disc", { height: .1, diameter: 0.32, tessellation: 32 }, this._scene);
        disc.material = discMat;

        disc.position.y = .385
        disc.position.x = 3.19

        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: 0.6, friction: 0.005 }, this._scene);
        disc.physicsImpostor.applyImpulse(new BABYLON.Vector3(-3, 0, 0), disc.getAbsolutePosition())
    }

    createRing(scene, innerRadius, outerRadius, height, tessellation, options): BABYLON.Mesh[] {
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

            box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, options, scene);
            boxes.push(box);
        }
        return boxes;
    }

    doRender(): void {
        console.log('running render loop');
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        console.log('adding resize listener');
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => new Game('game').createScene());