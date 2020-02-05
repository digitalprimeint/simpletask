function EntityError () {
    this.key = {};
    this.key["ConnectionFailed"] = { error: "Can't connect to the database", errorCode: 600, success: false };
    this.key["DocumentNotFound"] = { error: "Document not found in the collection", errorCode: 601, success: false };
    this.key["UniqueNotFound"] = { error: "The unique field does not exists in the schema", errorCode: 602, success: false };
}

exports.EntityError = function () {
    return new EntityError();
}