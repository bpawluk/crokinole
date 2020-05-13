export const TYPES = {
    // app entry class
    Game: Symbol.for("Game"),

    // constants 
    canvas_name: Symbol.for("canvas_name"),

    // game mechanics
    ISceneBuilder: Symbol.for("ISceneBuilder"),
    ILightsProvider: Symbol.for("ILightsProvider"),
    IPhysicsProvider: Symbol.for("IPhysicsProvider"),

    // game logic
    IGameController: Symbol.for("IGameController"),
    IPlayerFactory: Symbol.for("IPlayerFactory"),

    // services
    ICameraManager: Symbol.for("ICameraManager"),
    IComplexShapesBuilder: Symbol.for("IComplexShapesBuilder"),
    IUserInput: Symbol.for("IUserInput")
};