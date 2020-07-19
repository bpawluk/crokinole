export interface ICacheManager {
    store(key: string, value: object): boolean;
    retrieve(key: string): object;
}