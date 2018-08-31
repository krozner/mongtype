"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Types_1 = require("./Types");
class MongoRepository {
    /**
     * Creates an instance of MongoRepository.
     * @param {DBSource} dbSource Your MongoDB connection
     * @memberof MongoRepository
     */
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.collection = this.getCollection();
    }
    get options() {
        return Reflect.getMetadata(Types_1.COLLECTION_KEY, this);
    }
    /**
     * Finds a record by id
     *
     * @param {string} id
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    findById(id) {
        return this.findOne({ _id: new mongodb_1.ObjectID(id) });
    }
    /**
     * Finds a record by a list of conditions
     *
     * @param {object} conditions
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    async findOne(conditions) {
        const collection = await this.collection;
        const cursor = collection.find(conditions).limit(1);
        const res = await cursor.toArray();
        if (res && res.length) {
            let document = res[0];
            document = this.toggleId(document, false);
            document = await this.invokeEvents(Types_1.POST_KEY, ['find', 'findOne'], document);
            return document;
        }
    }
    /**
     * Find records by a list of conditions
     *
     * @param {FindRequest} [req={ conditions: {} }]
     * @returns {Promise<T[]>}
     * @memberof MongoRepository
     */
    async find(req = { conditions: {} }) {
        const collection = await this.collection;
        const conditions = this.toggleId(req.conditions, true);
        let cursor = collection.find(conditions);
        if (req.projection) {
            cursor = cursor.project(req.projection);
        }
        if (req.sort) {
            cursor = cursor.sort(req.sort);
        }
        if (req.limit) {
            cursor = cursor.limit(req.limit);
        }
        const newDocuments = await cursor.toArray();
        const results = [];
        for (let document of newDocuments) {
            document = this.toggleId(document, false);
            document = await this.invokeEvents(Types_1.POST_KEY, ['find', 'findMany'], document);
            results.push(document);
        }
        return results;
    }
    /**
     * Create a document of type T
     *
     * @param {T} document
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    async create(document) {
        const collection = await this.collection;
        document = await this.invokeEvents(Types_1.PRE_KEY, ['save', 'create'], document);
        const res = await collection.insertOne(document);
        let newDocument = res.ops[0];
        newDocument = this.toggleId(newDocument, false);
        newDocument = await this.invokeEvents(Types_1.POST_KEY, ['save', 'create'], newDocument);
        return newDocument;
    }
    /**
     * Save any changes to your document
     *
     * @param {Document} document
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    async save(document) {
        const collection = await this.collection;
        // flip/flop ids
        const id = new mongodb_1.ObjectID(document.id);
        const updates = await this.invokeEvents(Types_1.PRE_KEY, ['save'], document);
        delete updates['id'];
        delete updates['_id'];
        const res = await collection.updateOne({ _id: id }, { $set: updates }, { upsert: true });
        let newDocument = await collection.findOne({ _id: id });
        // project new items
        if (newDocument) {
            Object.assign(document, newDocument);
        }
        // flip flop ids back
        newDocument['id'] = id.toString();
        delete newDocument['_id'];
        newDocument = await this.invokeEvents(Types_1.POST_KEY, ['save'], newDocument);
        return newDocument;
    }
    /**
     * Find a record by ID and update with new values
     *
     * @param {string} id
     * @param {UpdateByIdRequest} req
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    async findOneByIdAndUpdate(id, req) {
        return this.findOneAndUpdate({
            conditions: { _id: new mongodb_1.ObjectID(id) },
            updates: req.updates,
            upsert: req.upsert
        });
    }
    /**
     * Find a record and update with new values
     *
     * @param {UpdateRequest} req
     * @returns {Promise<T>}
     * @memberof MongoRepository
     */
    async findOneAndUpdate(req) {
        const collection = await this.collection;
        const updates = await this.invokeEvents(Types_1.PRE_KEY, ['update', 'updateOne'], req.updates);
        const res = await collection.findOneAndUpdate(req.conditions, updates, {
            upsert: req.upsert,
            returnOriginal: false
        });
        let document = res.value;
        document = this.toggleId(document, false);
        document = await this.invokeEvents(Types_1.POST_KEY, ['update', 'updateOne'], document);
        return document;
    }
    /**
     * Delete a record by ID
     *
     * @param {string} id
     * @returns {Promise<DeleteWriteOpResultObject>}
     * @memberof MongoRepository
     */
    async deleteOneById(id) {
        return this.deleteOne({
            _id: new mongodb_1.ObjectID(id)
        });
    }
    /**
     * Delete a record
     *
     * @param {*} conditions
     * @returns {Promise<DeleteWriteOpResultObject>}
     * @memberof MongoRepository
     */
    async deleteOne(conditions) {
        const collection = await this.collection;
        await this.invokeEvents(Types_1.PRE_KEY, ['delete', 'deleteOne'], conditions);
        const deleteResult = collection.deleteOne(conditions);
        await this.invokeEvents(Types_1.POST_KEY, ['delete', 'deleteOne'], deleteResult);
        return deleteResult;
    }
    /**
     * Delete multiple records
     *
     * @param {*} conditions
     * @returns {Promise<any>}
     * @memberof MongoRepository
     */
    async deleteMany(conditions) {
        const collection = await this.collection;
        await this.invokeEvents(Types_1.PRE_KEY, ['delete', 'deleteMany'], conditions);
        const deleteResult = collection.deleteMany(conditions);
        await this.invokeEvents(Types_1.POST_KEY, ['delete', 'deleteMany'], deleteResult);
        return deleteResult;
    }
    /**
     * Return a collection
     * If the collection doesn't exist, it will create it with the given options
     *
     * @protected
     * @returns {Promise<Collection<T>>}
     * @memberof MongoRepository
     */
    getCollection() {
        return new Promise(async (resolve, reject) => {
            const db = await this.dbSource.db;
            db.collection(this.options.name, { strict: true }, async (err, collection) => {
                if (err) {
                    try {
                        const createdCollection = await db.createCollection(this.options.name, {
                            size: this.options.size,
                            capped: this.options.capped,
                            max: this.options.max
                        });
                        resolve(createdCollection);
                    }
                    catch (createErr) {
                        reject(createErr);
                    }
                }
                else {
                    resolve(collection);
                }
            });
        });
    }
    /**
     * Strip off Mongo's ObjectID and replace with string representation or in reverese
     *
     * @private
     * @param {*} document
     * @param {boolean} replace
     * @returns {T}
     * @memberof MongoRepository
     */
    toggleId(document, replace) {
        if (document && (document.id || document._id)) {
            if (replace) {
                document._id = new mongodb_1.ObjectID(document.id);
                delete document.id;
            }
            else {
                document.id = document._id.toString();
                delete document._id;
            }
        }
        return document;
    }
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
    async invokeEvents(type, fns, document) {
        for (const fn of fns) {
            const events = Reflect.getMetadata(`${type}_${fn}`, this) || [];
            for (const event of events) {
                document = event.bind(this)(document);
                if (typeof document.then === 'function') {
                    document = await document;
                }
            }
        }
        return document;
    }
}
exports.MongoRepository = MongoRepository;
//# sourceMappingURL=Repository.js.map