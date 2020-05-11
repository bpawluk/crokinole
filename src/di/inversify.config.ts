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

const gameDependencyContainer = new Container();
// app entry class
gameDependencyContainer.bind<Game>(TYPES.Game).to(Game);

// constants
gameDependencyContainer.bind<string>(TYPES.canvas_name).toConstantValue("game");

// game mechanics
gameDependencyContainer.bind<ISceneBuilder>(TYPES.ISceneBuilder).to(CrokinoleSceneBuilder);
gameDependencyContainer.bind<ILightsProvider>(TYPES.ILightsProvider).to(CrokinoleLightsProvider);
gameDependencyContainer.bind<IPhysicsProvider>(TYPES.IPhysicsProvider).to(CrokinolePhysicsProvider);

// services 
gameDependencyContainer.bind<ICameraManager>(TYPES.ICameraManager).to(CameraManager);
gameDependencyContainer.bind<IComplexShapesBuilder>(TYPES.IComplexShapesBuilder).to(ComplexShapesBuilder);

export { gameDependencyContainer };