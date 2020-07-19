import { injectable } from "inversify";
import { ICacheManager } from "./interfaces/ICacheManager";

@injectable()
export class MemoryCacheManager implements ICacheManager {
    private _memoryCache: Map<string, object>;

    constructor() {
        this._memoryCache = new Map<string, object>();
    }

    store(key: string, value: object): boolean {
        this._memoryCache.set(key, value);
        return true;
    }

    retrieve(key: string): object {
        return this._memoryCache.get(key);
    }
}