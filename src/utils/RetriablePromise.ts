export class RetriablePromise<T> extends Promise<T> {
    private _executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        super(executor);
        this._executor = executor;
    }

    retry(retries: number, interval: number = 0): Promise<T> {
        return this.catch(async error => {
            if(retries > 0) {
                if(interval > 0) {
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
                return new RetriablePromise(this._executor).retry(retries - 1, interval);
            } else {
                return Promise.reject(error);
            }
        });
    }
}