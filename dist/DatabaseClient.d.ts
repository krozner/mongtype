/// <reference types="node" />
import { EventEmitter } from 'events';
import { Db, MongoClient } from 'mongodb';
export declare class DatabaseClient extends EventEmitter {
    client: Promise<MongoClient>;
    db: Promise<Db>;
    private uri;
    private deferredClient;
    private deferredDb;
    /**
     * Creates an instance of DatabaseClient.
     * @memberof DatabaseClient
     */
    constructor();
    /**
     * Connect to the mongodb
     *
     * @param {string} uri The uri of the MongoDB instance
     * @param {(MongoClient|Promise<MongoClient>)} [client] Optional instantiated MongoDB connection
     * @returns {Promise<MongoClient>}
     * @memberof DatabaseClient
     */
    connect(uri: string, client?: MongoClient | Promise<MongoClient>): Promise<Db>;
    /**
     * Close the connection
     *
     * @returns {Promise<void>}
     * @memberof DatabaseClient
     */
    close(): Promise<void>;
    /**
     * Create a connection to the MongoDB instance
     * Will retry if connection fails initially
     *
     * @private
     * @param {string} uri
     * @returns {Promise<MongoClient>}
     * @memberof DatabaseClient
     */
    private createClient;
}
