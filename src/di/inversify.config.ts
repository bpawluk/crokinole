import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Game } from "../Game";
import { IComplexShapesBuilder } from "../services/IComplexShapesBuilder";
import { ComplexShapesBuilder } from "../services/ComplexShapesBuilder";
import { ISceneBuilder } from "../mechanics/ISceneBuilder";
import { CrokinoleSceneBuilder } from "../mechanics/CrokinoleSceneBuilder";
import { IPhysicsProvider } from "../mechanics/IPhysicsProvider";
import { CrokinolePhysicsProvider } from "../mechanics/CrokinolePhysicsProvider";
import { ILightsProvider } from "../mechanics/ILightsProvider";
import { CrokinoleLightsProvider } from "../mechanics/CrokinoleLightsProvider";
import { ICameraManager } from "../services/ICameraManager";
import { CameraManager } from "../services/CameraManager";
import { IGameController } from "../game_logic/IGameController";
import { GameController } from "../game_logic/GameController";
import { IUserInput } from "../services/IUserInput";
import { UserInput } from "../services/UserInput";
import { IPlayerFactory } from "../game_logic/IPlayerFactory";
import { PlayerFactory } from "../game_logic/PlayerFactory";
import { IGuiProvider } from "../gui/IGuiProvider";
import { GuiProvider } from "../gui/GuiProvider";
import { IMakingMoveGui } from "../gui/IMakingMoveGui";
import { MakingMoveGui } from "../gui/MakingMoveGui";
import { IVectorMathHelper } from "../services/IVectorMathHelper";
import { VectorMathHelper } from "../services/VectorMathHelper";

const gameDependencyContainer = new Container();
// app entry class
gameDependencyContainer.bind<Game>(TYPES.Game).to(Game).inSingletonScope();

// constants
gameDependencyContainer.bind<string>(TYPES.canvas_name).toConstantValue("game");

// game mechanics
gameDependencyContainer.bind<ISceneBuilder>(TYPES.ISceneBuilder).to(CrokinoleSceneBuilder).inSingletonScope();
gameDependencyContainer.bind<ILightsProvider>(TYPES.ILightsProvider).to(CrokinoleLightsProvider);
gameDependencyContainer.bind<IPhysicsProvider>(TYPES.IPhysicsProvider).to(CrokinolePhysicsProvider);

// gui
gameDependencyContainer.bind<IGuiProvider>(TYPES.IGuiProvider).to(GuiProvider).inSingletonScope();
gameDependencyContainer.bind<IMakingMoveGui>(TYPES.IMakingMoveGui).to(MakingMoveGui).inSingletonScope();

// game logic
gameDependencyContainer.bind<IGameController>(TYPES.IGameController).to(GameController);
gameDependencyContainer.bind<IPlayerFactory>(TYPES.IPlayerFactory).to(PlayerFactory);

// services 
gameDependencyContainer.bind<ICameraManager>(TYPES.ICameraManager).to(CameraManager).inSingletonScope();
gameDependencyContainer.bind<IComplexShapesBuilder>(TYPES.IComplexShapesBuilder).to(ComplexShapesBuilder);
gameDependencyContainer.bind<IUserInput>(TYPES.IUserInput).to(UserInput).inSingletonScope();
gameDependencyContainer.bind<IVectorMathHelper>(TYPES.IVectorMathHelper).to(VectorMathHelper);

export { gameDependencyContainer };