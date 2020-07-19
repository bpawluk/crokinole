import { IConfigProvider } from "./IConfigProvider";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class LocalConfigProvider implements IConfigProvider {
    async init(): Promise<void> {
        return;
    }

    getSetting(key: string): any {
        return;
    }
}