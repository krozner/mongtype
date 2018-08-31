import { CollectionProps } from './Types';
/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
export declare function Collection(props: CollectionProps): (target: any) => void;
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
export declare function Before(...events: string[]): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
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
export declare function After(...events: string[]): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
