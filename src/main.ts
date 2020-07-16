import { gameDependencyContainer } from "./di/inversify.config";
import { TYPES } from "./di/types";
import { Game } from "./game";

window.addEventListener('DOMContentLoaded', () => gameDependencyContainer.get<Game>(TYPES.Game).start());