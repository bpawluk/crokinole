export const TYPES = {
    // app entry class
    Game: Symbol.for("Game"),

    // config 
    canvas_name: Symbol.for("canvas_name"),
    config_path: Symbol.for("config_path"),
    IConfigProvider: Symbol.for("IConfigProvider"),

    // game logic
    IGameController: Symbol.for("IGameController"),
    IPlayerFactory: Symbol.for("IPlayerFactory"),
    IPawnProvider: Symbol.for("IPawnProvider"),
    IPawnPositionHelper: Symbol.for("IPawnPositionHelper"),

    // gui
    IGuiProvider: Symbol.for("IGuiProvider"),
    IMakingMoveGui: Symbol.for("IMakingMoveGui"),
    IGameStateGui: Symbol.for("IGameStateGui"),
    IMenuGui: Symbol.for("IMenuGui"),

    // helpers
    ICacheManager: Symbol.for("ICacheManager"),
    IComplexShapesBuilder: Symbol.for("IComplexShapesBuilder"),
    IFramesTimer: Symbol.for("IFramesTimer"),
    IHttpRequestSender: Symbol.for("IHttpRequestSender"),
    IPointerEventsManager: Symbol.for("IPointerEventsManager"),

    // scene
    ICameraManager: Symbol.for("ICameraManager"),
    ISceneBuilder: Symbol.for("ISceneBuilder"),
    ILightsProvider: Symbol.for("ILightsProvider"),
    ILoadingScreen: Symbol.for("ILoadingScreen"),
    IMaterialsProvider: Symbol.for("IMaterialsProvider"),
    IPhysicsProvider: Symbol.for("IPhysicsProvider"),
    ISkyboxBuilder: Symbol.for("ISkyboxBuilder"),
    ITexturePainter: Symbol.for("ITexturePainter")
};