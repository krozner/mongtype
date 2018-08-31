"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Deferred object based on MDN spec
 * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
 *
 * @export
 * @class Deferred
 * @template T
 */
class Deferred {
    constructor() {
        this.promise = new Promise(function (resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
        }.bind(this));
        Object.freeze(this);
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=Deferred.js.map