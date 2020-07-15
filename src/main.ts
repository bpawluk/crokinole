import { NativeObjectsExtender } from "./helpers/NativeObjectsExtender";
import { gameDependencyContainer } from "./di/inversify.config";
import { TYPES } from "./di/types";
import { Game } from "./game";

new NativeObjectsExtender().extendAll();

window.addEventListener('DOMContentLoaded', () => gameDependencyContainer.get<Game>(TYPES.Game).start());