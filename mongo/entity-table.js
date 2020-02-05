const SchemaValidation = require('./entity-schema-validation').SchemaValidation();
const EntityError = require('./entity-errors').EntityError();

function EntityTable (schema, tableName, db) {
    var self = this;
    this.collection = tableName;
    this.db = db;
    this.schema = schema;

    this.createObjectID = function (id) {
        return this.db.createObjectID(id);
    }

    this.has = async function (model) {
        var result = SchemaValidation.validate(this.schema, model, true);
        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        if(result.success) {
            var query = {};
            var queryCreated = false;

            Object.getOwnPropertyNames(this.schema).forEach(function(name, idx, array) {
                if(self.schema[name].unique !== undefined) {
                    if(self.schema[name].unique == true) {
                        query[name] = model[name];
                        queryCreated = true;
                    }
                }
            });

            if(!queryCreated) {
                response = EntityError.key["UniqueNotFound"];
            }

            if(response.success) {
                response = await this.db.exists(this.collection, query);
                delete response.data;
            }
        }
        else {
            response.error = result.error;
            response.errorCode = result.errorCode === undefined ? 500 : result.errorCode;;
            response.success = false;

            if(result.rule !== undefined) {
                if(result.rule.code !== undefined) {
                    if(typeof result.rule.code === "number") {
                        response.errorCode = result.rule.code;
                    }
                }
            }
        }

        return response;
    }

    this.getAll = async function (exclude) {
        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        response = await this.db.select(this.collection, {}, exclude);

        return response;
    }

    this.get = async function (query, exclude) {
        var result = SchemaValidation.validate(this.schema, query, true);
        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        if(result.success) {
            response = await this.db.select(this.collection, query, exclude);
        }
        else {
            response.error = result.error;
            response.errorCode = result.errorCode === undefined ? 500 : result.errorCode;;
            response.success = false;

            if(result.rule !== undefined) {
                if(result.rule.code !== undefined) {
                    if(typeof result.rule.code === "number") {
                        response.errorCode = result.rule.code;
                    }
                }
            }
        }

        return response;
    }

    this.add = async function (model) {
        var result = SchemaValidation.validate(this.schema, model);
        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        if(result.success) {
            response = await this.db.insert(this.collection, model);
        }
        else {
            response.error = result.error;
            response.errorCode = result.errorCode === undefined ? 500 : result.errorCode;;
            response.success = false;

            if(result.rule !== undefined) {
                if(result.rule.code !== undefined) {
                    if(typeof result.rule.code === "number") {
                        response.errorCode = result.rule.code;
                    }
                }
            }
        }

        return response;
    }

    this.change = async function (query, model) {
        var result = SchemaValidation.validate(this.schema, model, true);
        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        if(result.success) {
            response = await this.db.update(this.collection, query, model);
            response.data = {
                modifiedCount: response.data.modifiedCount
            };
        }
        else {
            response.error = result.error;
            response.errorCode = result.errorCode === undefined ? 500 : result.errorCode;;
            response.success = false;

            if(result.rule !== undefined) {
                if(result.rule.code !== undefined) {
                    if(typeof result.rule.code === "number") {
                        response.errorCode = result.rule.code;
                    }
                }
            }
        }

        return response;
    }

    this.remove = async function (model) {
        var result = SchemaValidation.validate(this.schema, model, true);
        var response = {
            error: "",
            errorCode: 0,
            success: true
        }

        if(result.success) {
            var query = {};
            var queryCreated = false;

            Object.getOwnPropertyNames(this.schema).forEach(function(name, idx, array) {
                if(self.schema[name].unique !== undefined) {
                    if(self.schema[name].unique == true) {
                        query[name] = model[name];
                        queryCreated = true;
                    }
                }
            });

            if(!queryCreated) {
                response = EntityError.key["UniqueNotFound"];
            }

            if(response.success) {
                response = await this.db.delete(this.collection, query);
            }
        }
        else {
            response.error = result.error;
            response.errorCode = result.errorCode === undefined ? 500 : result.errorCode;
            response.success = false;

            if(result.rule !== undefined) {
                if(result.rule.code !== undefined) {
                    if(typeof result.rule.code === "number") {
                        response.errorCode = result.rule.code;
                    }
                }
            }
        }

        return response;
    }
}

exports.EntityTable = function () {
    this.create = function (schema, tableName, db) {
        return new EntityTable(schema, tableName, db);
    }
}