import { IConfigProvider } from "./IConfigProvider";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class OnlineConfigProvider implements IConfigProvider {
    private _config: object;
    @inject(TYPES.config_path) _path: string; 

    async init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.makeRequest()
                .then(config => {
                    console.log(config);
                    this._config = config;
                    resolve();
                })
                .catch(async reason => {
                    console.log(reason)
                    await this.init();
                    // TODO: add delay and provide universal solution
                });
        });
    }

    getSetting(key: string): any {
        var properties = key.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this._config);
    }

    // TODO: move to helper class
    private async makeRequest(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            var req = new XMLHttpRequest();
            req.open('GET', this._path, true);
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200)
                        resolve(req.response)
                    else
                        reject(req.statusText);
                }
            };
            req.send();
        })
    }
}