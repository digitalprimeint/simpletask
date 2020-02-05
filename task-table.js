const mongodb = require("./mongo/entity").mongodb;

function taskTable () {
    var schema = {
        "_id": {
            required: false,
            unique: true
        },
        title: {
            required: true,
            typeof: "string",
            min: 4,
            code: 550
        },
        description: {
            required: true,
            typeof: "string",
            min: 4,
            code: 560
        },
        priority: {
            required: true,
            typeof: "string",
            code: 570
        }
    };

    var table = mongodb.server("mongodb+srv://demo:demo123@cluster0-oh2hw.mongodb.net/taskdemo?retryWrites=true&w=majority")
                        .db("taskdemo")
                        .table(schema, "tasks");

    return table;
}

exports.tableTask = taskTable();