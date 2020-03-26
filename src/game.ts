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
    }

    onSceneLoaded(scene: BABYLON.Scene): void {
        console.log('scene loaded');
        this._scene = scene;
        scene.executeWhenReady(() => this.initScene());
    }

    initScene(): void {
        console.log('scene ready');
        this.generateLights();
        this.setupCamera();
        this.doRender();
    }

    generateLights(): void {
        new BABYLON.SpotLight("left", new BABYLON.Vector3(0.5, 0.35, 0), new BABYLON.Vector3(-1, -1, 0), Math.PI/2, 1, this._scene);
        new BABYLON.SpotLight("right", new BABYLON.Vector3(-0.5, 0.35, 0), new BABYLON.Vector3(1, -1, 0), Math.PI/2, 1, this._scene);
        new BABYLON.SpotLight("top", new BABYLON.Vector3(0, 0.35, 0.5), new BABYLON.Vector3(0, -1, -1), Math.PI/2, 1, this._scene);
        new BABYLON.SpotLight("bottom", new BABYLON.Vector3(0, 0.35, -0.5), new BABYLON.Vector3(0, -1, 1), Math.PI/2, 1, this._scene);
    }

    setupCamera(): void {
        this._camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0.75, 1.25), this._scene);
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.attachControl(this._canvas);
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