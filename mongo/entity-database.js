const MongoClient = require('mongodb').MongoClient;
const EntityTable = require('./entity-table').EntityTable;
const EntityError = require('./entity-errors').EntityError();
const ObjectID = require('mongodb').ObjectID;

function EntityDatabase(dbName, server, options) {
    this.name = dbName;
    this.server = server;
    this.options = options;

    this.table = function (schema, name) {
        return new EntityTable().create(schema, name, this);
    }

    this.createObjectID = function (id) {
        return new ObjectID(id);
    }

    this.addCacheRule = async function (collection, field, seconds) {
        const client = await MongoClient.connect(this.server.connection, { useNewUrlParser: true })
                            .catch(function (err) {});

        try {
            const db = client.db(this.name);
            var collectionCreated = await db.listCollections({ name: collection}).toArray();
            tableExists = collectionCreated.length > 0 ? true : false;

            if(!tableExists) {
                var table = await db.createCollection(collection);
                var cacheFieldRule = {};
                cacheFieldRule[field] = 1;
                var indexCreated = await table.createIndex(cacheFieldRule, { expireAfterSeconds: seconds });
            }
        }
        catch(ex) {
            console.log(ex);
        }
        finally
        {
            client.close();
        }
    }

    this.exists = async function (collection, query) {
        const client = await MongoClient.connect(this.server.connection, { useNewUrlParser: true })
                            .catch(function (err) {});

        if(!client) {
            return EntityError.key["ConnectionFailed"];
        }

        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        try {
            const db = client.db(this.name);
            response.data = await db.collection(collection).findOne(query);

            if(response.data == null) {
                response = EntityError.key["DocumentNotFound"];
            }
        } 
        catch (err) {
            response.error = err;
            response.errorCode = 500;
            response.success = false;
        }
        finally {
            if(client.close !== undefined) {
                client.close();
            }
        }

        return response;
    }

    this.select = async function (collection, query, exclude) {
        const client = await MongoClient.connect(this.server.connection, { useNewUrlParser: true })
                            .catch(function (err) {});

        if(!client) {
            return EntityError.key["ConnectionFailed"];
        }

        var response = {
            error: "",
            errorCode: 0,
            success: true,
            data: {}
        }

        try {
            const db = client.db(this.name);
            if(exclude === undefined) {
                response.data = await db.collection(collection).find(query).toArray();
            }
            else {
                response.data = await db.collection(collection).find(query, { projection: exclude }).toArray();
            }

            if(response.data.length == 1) {
                response.data = response.data[0];
            }
        } 
        catch (err) {
            response.error = err;
            response.errorCode = 500;
            response.success = false;
        }
        finally {
            if(client.close !== undefined) {
                client.close();
            }
        }

        return response;
    }

    this.insert = async function (collection, model) {
        const client = await MongoClient.connect(this.server.connection, { useNewUrlParser: true })
                            .catch(function (err) {});

        if(!client) {
            return EntityError.key["ConnectionFailed"];
        }

        var response = {
            error: "",
            errorCode: 0,
            success: true,
            data: {}
        }

        try {
            const db = client.db(this.name);
            delete model._id;
            response.data = await db.collection(collection).insertMany([model]);

            if(response.data.length == 1) {
                response.data = response.data[0];
            }
        } 
        catch (err) {
            response.error = err;
            response.errorCode = 500;
            response.success = false;
        }
        finally {
            if(client.close !== undefined) {
                client.close();
            }
        }

        return response;
    }

    this.update = async function (collection, query, model) {
        const client = await MongoClient.connect(this.server.connection, { useNewUrlParser: true })
                            .catch(function (err) {});

        if(!client) {
            return EntityError.key["ConnectionFailed"];
        }

        var response = {
            error: "",
            errorCode: 0,
            success: true,
            data: {}
        }

        try {
            const db = client.db(this.name);
            response.data = await db.collection(collection).updateOne(query, { $set: model });
        } 
        catch (err) {
            response.error = err;
            response.errorCode = 500;
            response.success = false;
        }
        finally {
            if(client.close !== undefined) {
                client.close();
            }
        }

        return response;
    }

    this.delete = async function (collection, query) {
        const client = await MongoClient.connect(this.server.connection, { useNewUrlParser: true })
                            .catch(function (err) {});

        if(!client) {
            return EntityError.key["ConnectionFailed"];
        }

        var response = {
            error: "",
            errorCode: 0,
            success: true,
            data: {}
        }

        try {
            const db = client.db(this.name);
            response.data = await db.collection(collection).deleteOne(query);
        } 
        catch (err) {
            response.error = err;
            response.errorCode = 500;
            response.success = false;
        }
        finally {
            if(client.close !== undefined) {
                client.close();
            }
        }

        return response;
    }

    if(this.options !== undefined) {
        if(this.options.cache !== undefined) {
            if(this.options.cache.collection !== undefined &&
                this.options.cache.field !== undefined &&
                this.options.cache.seconds !== undefined) {
                this.addCacheRule(this.options.cache.collection, this.options.cache.field, this.options.cache.seconds);
            }
        }
    }
}

exports.EntityDatabase = function () {
    this.create = function (dbName, server, options) {
        return new EntityDatabase(dbName, server, options);
    }
}