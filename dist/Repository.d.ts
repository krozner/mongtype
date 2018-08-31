import { Collection, DeleteWriteOpResultObject } from 'mongodb';
import { CollectionProps, DBSource, Document, FindRequest, UpdateByIdRequest, UpdateRequest } from './Types';
export declare class MongoRepository<T> {
    dbSource: DBSource;
    collection: Promise<Collection<T>>;
    readonly options: CollectionProps;
    /**
     * Creates an instance of MongoRepository.
     * @param {DBSource} dbSource Your MongoDB connection
     * @memberof MongoRepository
     */
    constructor(dbSource: DBSource);
    /**
     * Finds a record by id
     *
     * @param {string} id
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    findById(id: string): Promise<T>;
    /**
     * Finds a record by a list of conditions
     *
     * @param {object} conditions
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    findOne(conditions: object): Promise<T>;
    /**
     * Find records by a list of conditions
     *
     * @param {FindRequest} [req={ conditions: {} }]
     * @returns {Promise<T[]>}
     * @memberof MongoRepository
     */
    find(req?: FindRequest): Promise<T[]>;
    /**
     * Create a document of type T
     *
     * @param {T} document
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    create(document: T): Promise<T>;
    /**
     * Save any changes to your document
     *
     * @param {Document} document
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    save(document: Document): Promise<T>;
    /**
     * Find a record by ID and update with new values
     *
     * @param {string} id
     * @param {UpdateByIdRequest} req
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    findOneByIdAndUpdate(id: string, req: UpdateByIdRequest): Promise<T>;
    /**
     * Find a record and update with new values
     *
     * @param {UpdateRequest} req
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    findOneAndUpdate(req: UpdateRequest): Promise<T>;
    /**
     * Delete a record by ID
     *
     * @param {string} id
     * @returns {Promise<DeleteWriteOpResultObject>}
     * @memberof MongoRepository
     */
    deleteOneById(id: string): Promise<DeleteWriteOpResultObject>;
    /**
     * Delete a record
     *
     * @param {*} conditions
     * @returns {Promise<DeleteWriteOpResultObject>}
     * @memberof MongoRepository
     */
    deleteOne(conditions: any): Promise<DeleteWriteOpResultObject>;
    /**
     * Delete multiple records
     *
     * @param {*} conditions
     * @returns {Promise<any>}
     * @memberof MongoRepository
     */
    deleteMany(conditions: any): Promise<DeleteWriteOpResultObject>;
    /**
     * Return a collection
     * If the collection doesn't exist, it will create it with the given options
     *
     * @protected
     * @returns {Promise<Collection<T>>}
     * @memberof MongoRepository
     */
    protected getCollection(): Promise<Collection<T>>;
    /**
     * Strip off Mongo's ObjectID and replace with string representation or in reverese
     *
     * @private
     * @param {*} document
     * @param {boolean} replace
     * @returns {T}
     * @memberof MongoRepository
     */
    private toggleId;
    /**
     * Apply functions to a record based on the type of event
     *
     * @private
     * @param {string} type any of the valid types, PRE_KEY POST_KEY
     * @param {string[]} fns any of the valid functions: update, updateOne, save, create, find, findOne, findMany
     * @param {*} document The document to apply functions to
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    private invokeEvents;
}
