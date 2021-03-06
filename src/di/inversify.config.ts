import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Game } from "../Game";
import { IComplexShapesBuilder } from "../helpers/interfaces/IComplexShapesBuilder";
import { ComplexShapesBuilder } from "../helpers/ComplexShapesBuilder";
import { ISceneBuilder } from "../scene/interfaces/ISceneBuilder";
import { SceneBuilder } from "../scene/SceneBuilder";
import { IPhysicsProvider } from "../scene/interfaces/IPhysicsProvider";
import { CrokinolePhysicsProvider } from "../scene/CrokinolePhysicsProvider";
import { ILightsProvider } from "../scene/interfaces/ILightsProvider";
import { CrokinoleLightsProvider } from "../scene/LightsProvider";
import { ICameraManager } from "../scene/interfaces/ICameraManager";
import { CrokinoleCameraManager } from "../scene/CameraManager";
import { IGameController } from "../game_logic/interfaces/IGameController";
import { GameController } from "../game_logic/GameController";
import { IPointerEventsManager } from "../helpers/interfaces/IPointerEventsManager";
import { PointerEventsManager } from "../helpers/PointerEventsManager";
import { IPlayerFactory } from "../game_logic/interfaces/IPlayerFactory";
import { PlayerFactory } from "../game_logic/PlayerFactory";
import { IGuiProvider } from "../gui/interfaces/IGuiProvider";
import { GuiProvider } from "../gui/GuiProvider";
import { IMakingMoveGui } from "../gui/interfaces/IMakingMoveGui";
import { MakingMoveGui } from "../gui/MakingMoveGui";
import { IGameStateGui } from "../gui/interfaces/IGameStateGui";
import { GameStateGui } from "../gui/GameStateGui";
import { IMenuGui } from "../gui/interfaces/IMenuGui";
import { MenuGui } from "../gui/MenuGui";
import { IPawnProvider } from "../game_logic/interfaces/IPawnProvider";
import { PawnProvider } from "../game_logic/PawnProvider";
import { IPawnPositionHelper } from "../game_logic/interfaces/IPawnPositionHelper";
import { PawnPositionHelper } from "../game_logic/PawnPositionHelper";
import { IConfigProvider } from "../config/IConfigProvider";
import { OnlineConfigProvider } from "../config/OnlineConfigProvider";
import { IHttpRequestSender } from "../helpers/interfaces/IHttpRequestSender";
import { HttpRequestSender } from "../helpers/HttpRequestSender";
import { ICacheManager } from "../helpers/interfaces/ICacheManager";
import { MemoryCacheManager } from "../helpers/MemoryCacheManager";
import { ITexturePainter } from "../scene/interfaces/ITexturesPainter";
import { TexturePainter } from "../scene/TexturePainter";
import { CrokinoleLoadingScreen } from "../scene/CrokinoleLoadingScreen";
import { IMaterialsProvider } from "../scene/interfaces/IMaterialsProvider";
import { StandardMaterialsProvider } from "../scene/StandardMaterialsProvider";
import { ISkyboxBuilder } from "../scene/interfaces/ISkyboxBuilder";
import { SkyboxBuilder } from "../scene/SkyboxBuilder";
import { IFramesTimer } from "../helpers/interfaces/IFramesTimer";
import { FramesTimer } from "../helpers/FramesTimer";

const gameDependencyContainer = new Container();

// app entry class
gameDependencyContainer.bind<Game>(TYPES.Game).to(Game).inSingletonScope();

// config
gameDependencyContainer.bind<string>(TYPES.canvas_name).toConstantValue("game");
gameDependencyContainer.bind<string>(TYPES.config_path).toConstantValue("game-config.json");
gameDependencyContainer.bind<IConfigProvider>(TYPES.IConfigProvider).to(OnlineConfigProvider).inSingletonScope();

// game logic
gameDependencyContainer.bind<IGameController>(TYPES.IGameController).to(GameController);
gameDependencyContainer.bind<IPlayerFactory>(TYPES.IPlayerFactory).to(PlayerFactory);
gameDependencyContainer.bind<IPawnProvider>(TYPES.IPawnProvider).to(PawnProvider).inSingletonScope();
gameDependencyContainer.bind<IPawnPositionHelper>(TYPES.IPawnPositionHelper).to(PawnPositionHelper);

// gui
gameDependencyContainer.bind<IGuiProvider>(TYPES.IGuiProvider).to(GuiProvider).inSingletonScope();
gameDependencyContainer.bind<IMakingMoveGui>(TYPES.IMakingMoveGui).to(MakingMoveGui).inSingletonScope();
gameDependencyContainer.bind<IGameStateGui>(TYPES.IGameStateGui).to(GameStateGui).inSingletonScope();
gameDependencyContainer.bind<IMenuGui>(TYPES.IMenuGui).to(MenuGui).inSingletonScope();

// helpers 
gameDependencyContainer.bind<ICacheManager>(TYPES.ICacheManager).to(MemoryCacheManager).inSingletonScope();
gameDependencyContainer.bind<IComplexShapesBuilder>(TYPES.IComplexShapesBuilder).to(ComplexShapesBuilder);
gameDependencyContainer.bind<IFramesTimer>(TYPES.IFramesTimer).to(FramesTimer).inSingletonScope();
gameDependencyContainer.bind<IHttpRequestSender>(TYPES.IHttpRequestSender).to(HttpRequestSender);
gameDependencyContainer.bind<IPointerEventsManager>(TYPES.IPointerEventsManager).to(PointerEventsManager).inSingletonScope();

// scene
gameDependencyContainer.bind<ICameraManager>(TYPES.ICameraManager).to(CrokinoleCameraManager).inSingletonScope();
gameDependencyContainer.bind<ILightsProvider>(TYPES.ILightsProvider).to(CrokinoleLightsProvider);
gameDependencyContainer.bind<BABYLON.ILoadingScreen>(TYPES.ILoadingScreen).to(CrokinoleLoadingScreen);
gameDependencyContainer.bind<IMaterialsProvider>(TYPES.IMaterialsProvider).to(StandardMaterialsProvider);
gameDependencyContainer.bind<IPhysicsProvider>(TYPES.IPhysicsProvider).to(CrokinolePhysicsProvider);
gameDependencyContainer.bind<ISceneBuilder>(TYPES.ISceneBuilder).to(SceneBuilder).inSingletonScope();
gameDependencyContainer.bind<ISkyboxBuilder>(TYPES.ISkyboxBuilder).to(SkyboxBuilder);
gameDependencyContainer.bind<ITexturePainter>(TYPES.ITexturePainter).to(TexturePainter);

export { gameDependencyContainer };