export interface IHttpRequestSender {
    get(path: string): Promise<any>;
}