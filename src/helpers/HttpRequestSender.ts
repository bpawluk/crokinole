import { injectable } from "inversify";
import { RetriablePromise } from "../utils/RetriablePromise";
import { IHttpRequestSender } from "./interfaces/IHttpRequestSender";

@injectable()
export class HttpRequestSender implements IHttpRequestSender {
    private _numberOfRetries: number = 3;
    private _retriesIntervalInMs: number = 2000;

    async get(path: string): Promise<any> {
        return await this._makeRequest('GET', path).retry(this._numberOfRetries, this._retriesIntervalInMs);
    }

    private _makeRequest(method: string, path: string): RetriablePromise<any> {
        return new RetriablePromise<object>((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open(method, path, true);
            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(request.response);
                    }
                    else {
                        reject(request.statusText);
                    }
                }
            };
            request.send();
        })
    }
}