var Game = /** @class */ (function () {
    function Game(canvasElement) {
        this._canvas = document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
    }
    Game.prototype.createScene = function () {
        var _this = this;
        console.log('loading scene');
        BABYLON.SceneLoader.Load("", "crokinole.babylon", this._engine, function (scene) { return _this.onSceneLoaded(scene); });
    };
    Game.prototype.onSceneLoaded = function (scene) {
        var _this = this;
        console.log('scene loaded');
        this._scene = scene;
        scene.executeWhenReady(function () { return _this.initScene(); });
    };
    Game.prototype.initScene = function () {
        console.log('scene ready');
        this.generateLights();
        this.setupCamera();
        this.doRender();
    };
    Game.prototype.generateLights = function () {
        new BABYLON.SpotLight("left", new BABYLON.Vector3(0.5, 0.35, 0), new BABYLON.Vector3(-1, -1, 0), Math.PI / 2, 1, this._scene);
        new BABYLON.SpotLight("right", new BABYLON.Vector3(-0.5, 0.35, 0), new BABYLON.Vector3(1, -1, 0), Math.PI / 2, 1, this._scene);
        new BABYLON.SpotLight("top", new BABYLON.Vector3(0, 0.35, 0.5), new BABYLON.Vector3(0, -1, -1), Math.PI / 2, 1, this._scene);
        new BABYLON.SpotLight("bottom", new BABYLON.Vector3(0, 0.35, -0.5), new BABYLON.Vector3(0, -1, 1), Math.PI / 2, 1, this._scene);
    };
    Game.prototype.setupCamera = function () {
        this._camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0.5, 1.35), this._scene);
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.attachControl(this._canvas);
    };
    Game.prototype.doRender = function () {
        var _this = this;
        console.log('running render loop');
        this._engine.runRenderLoop(function () {
            _this._scene.render();
        });
        console.log('adding resize listener');
        window.addEventListener('resize', function () {
            _this._engine.resize();
        });
    };
    return Game;
}());
window.addEventListener('DOMContentLoaded', function () { return new Game('game').createScene(); });
