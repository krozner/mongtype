"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
function Collection(props) {
    return function (target) {
        Reflect.defineMetadata(Types_1.COLLECTION_KEY, props, target.prototype);
    };
}
exports.Collection = Collection;
/**
 * Run this function before an event occurs
 * - create
 * - delete
 * - deleteMany
 * - deleteOne
 * - find
 * - findMany
 * - findOne
 * - save
 * - update
 * - updateOne
 *
 * @export
 * @param {...string[]} events a list of events
 * @returns
 */
function Before(...events) {
    return function (target, name, descriptor) {
        for (const event of events) {
            const fns = Reflect.getMetadata(`${Types_1.PRE_KEY}_${event}`, target) || [];
            // you must create new array so you don't push fn into siblings
            // see https://github.com/rbuckton/reflect-metadata/issues/53#issuecomment-274906502
            const result = fns ? fns.concat([target[name]]) : [target[name]];
            Reflect.defineMetadata(`${Types_1.PRE_KEY}_${event}`, result, target);
        }
    };
}
exports.Before = Before;
/**
 * Run this function after an event occurs
 * - create
 * - delete
 * - deleteMany
 * - deleteOne
 * - find
 * - findMany
 * - findOne
 * - save
 * - update
 * - updateOne
 *
 * @export
 * @param {...string[]} events a list of events
 * @returns
 */
function After(...events) {
    return function (target, name, descriptor) {
        for (const event of events) {
            const fns = Reflect.getMetadata(`${Types_1.POST_KEY}_${event}`, target) || [];
            // you must create new array so you don't push fn into siblings
            // see https://github.com/rbuckton/reflect-metadata/issues/53#issuecomment-274906502
            const result = fns ? fns.concat([target[name]]) : [target[name]];
            Reflect.defineMetadata(`${Types_1.POST_KEY}_${event}`, result, target);
        }
    };
}
exports.After = After;
//# sourceMappingURL=Decorators.js.map