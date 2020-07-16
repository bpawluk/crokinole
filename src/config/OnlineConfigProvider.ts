import { IConfigProvider } from "./IConfigProvider";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { RetriablePromise } from "../utils/RetriablePromise";

@injectable()
export class OnlineConfigProvider implements IConfigProvider {
    private _config: object;
    @inject(TYPES.config_path) _path: string;

    async init(): Promise<void> {
        return new RetriablePromise<void>((resolve, reject) => {
            this.makeRequest()
                .then(config => {
                    this._config = config;
                    resolve();
                })
                .catch(reason => reject(reason));
        }).retry(3, 1000).catch(error => console.log("Config could not be fetched from provided path."));
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