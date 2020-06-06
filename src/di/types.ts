export const TYPES = {
    // app entry class
    Game: Symbol.for("Game"),

    // constants 
    canvas_name: Symbol.for("canvas_name"),

    // game mechanics
    ISceneBuilder: Symbol.for("ISceneBuilder"),
    ILightsProvider: Symbol.for("ILightsProvider"),
    IPhysicsProvider: Symbol.for("IPhysicsProvider"),

    // gui
    IGuiProvider: Symbol.for("IGuiProvider"),
    IMakingMoveGui: Symbol.for("IMakingMoveGui"),
    IGameStateGui: Symbol.for("IGameStateGui"),
    IMenuGui: Symbol.for("IMenuGui"),

    // game logic
    IGameController: Symbol.for("IGameController"),
    IPlayerFactory: Symbol.for("IPlayerFactory"),
    IPawnProvider: Symbol.for("IPawnProvider"),

    // services
    ICameraManager: Symbol.for("ICameraManager"),
    IComplexShapesBuilder: Symbol.for("IComplexShapesBuilder"),
    IUserInput: Symbol.for("IUserInput"),
    IVectorMathHelper: Symbol.for("IVectorMathHelper")
};