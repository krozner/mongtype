"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const mongodb_1 = require("mongodb");
const retry = require("retry");
const Deferred_1 = require("./Deferred");
class DatabaseClient extends events_1.EventEmitter {
    /**
     * Creates an instance of DatabaseClient.
     * @memberof DatabaseClient
     */
    constructor() {
        super();
        this.deferredClient = new Deferred_1.Deferred();
        this.client = this.deferredClient.promise;
        this.deferredDb = new Deferred_1.Deferred();
        this.db = this.deferredDb.promise;
    }
    /**
     * Connect to the mongodb
     *
     * @param {string} uri The uri of the MongoDB instance
     * @param {(MongoClient|Promise<MongoClient>)} [client] Optional instantiated MongoDB connection
     * @returns {Promise<MongoClient>}
     * @memberof DatabaseClient
     */
    async connect(uri, client) {
        this.uri = uri;
        if (client !== undefined) {
            this.deferredClient.resolve(client);
        }
        else {
            this.deferredClient.resolve(this.createClient(this.uri));
        }
        this.deferredDb.resolve((await this.client).db());
        return this.db;
    }
    /**
     * Close the connection
     *
     * @returns {Promise<void>}
     * @memberof DatabaseClient
     */
    async close() {
        const client = await this.client;
        return client.close();
    }
    /**
     * Create a connection to the MongoDB instance
     * Will retry if connection fails initially
     *
     * @private
     * @param {string} uri
     * @returns {Promise<MongoClient>}
     * @memberof DatabaseClient
     */
    createClient(uri) {
        return new Promise((resolve, reject) => {
            const operation = retry.operation();
            operation.attempt(async (attempt) => {
                try {
                    const client = await mongodb_1.MongoClient.connect(uri);
                    this.emit('connected', client);
                    resolve(client);
                }
                catch (e) {
                    if (operation.retry(e))
                        return;
                    this.emit('error', e);
                    reject(e);
                }
            });
        });
    }
}
exports.DatabaseClient = DatabaseClient;
//# sourceMappingURL=DatabaseClient.js.map