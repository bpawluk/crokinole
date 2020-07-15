export interface IConfigProvider {
    init(): Promise<void>;
    getSetting(key: string): any;
}