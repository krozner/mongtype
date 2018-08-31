/**
 * Deferred object based on MDN spec
 * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
 *
 * @export
 * @class Deferred
 * @template T
 */
export declare class Deferred<T> {
    resolve: any;
    reject: any;
    promise: Promise<T>;
    constructor();
}
