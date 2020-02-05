const EntityDatabase = require('./entity-database').EntityDatabase;

function Entity () {
    this.server = function (connection) {
        return new EntityServer(connection, this);
    }
}

function EntityServer (connection) {
    this.connection = connection;
    this.db = function (dbName, options) {
        return new EntityDatabase().create(dbName, this, options);
    }
}

exports.mongodb = new Entity();