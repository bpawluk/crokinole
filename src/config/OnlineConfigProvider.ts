import { IConfigProvider } from "./IConfigProvider";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IHttpRequestSender } from "../helpers/interfaces/IHttpRequestSender";

@injectable()
export class OnlineConfigProvider implements IConfigProvider {
    private _config: object;
    @inject(TYPES.config_path) private _path: string;
    @inject(TYPES.IHttpRequestSender) private _httpRequestSender: IHttpRequestSender;

    async init(): Promise<void> {
        try {
            this._config = JSON.parse(await this._httpRequestSender.get(this._path));
            console.log(this._config);
        } catch (error) {
            console.log("Config could not be fetched from provided path.")
        }
    }

    getSetting(key: string): any {
        var properties = key.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this._config);
    }
}